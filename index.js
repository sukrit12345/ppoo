const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const { DebtorInformation, LoanInformation } = require('./models'); // Assuming you saved the schema in 'models.js'

// กำหนดการใช้งาน bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // เพิ่ม middleware เพื่อให้ Express.js สามารถอ่านข้อมูลจาก form ได้
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs'); // สำหรับใช้งาน EJS

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost:27017/bank', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));



// API Endpoint เพื่อดึงข้อมูลจาก DebtorInformation
app.get('/api/debtor-data', async (req, res) => {
    try {
        const data = await DebtorInformation.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API Endpoint เพื่อดึงข้อมูลจาก Loaninformations
app.get('/api/loan-data', async (req, res) => {
    try {
        const data = await LoanInformation.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






// API Endpoint เพื่อดึงข้อมูล loan พร้อม join กับ debtor
app.get('/api/loan-user-data', async (req, res) => {
    try {
        const data = await DebtorInformation.aggregate([
            {
                $project: {
                    _id: 1,
                    id_card_number: 1,
                    fname: 1,
                    lname: 1,
                    loans: 1
                }
            },
            {
                $unwind: "$loans" // แปลง array ของ loans ที่มีหลาย element ไปเป็น object
            }
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});













// เส้นทาง GET เพื่อส่งไฟล์ HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ข้อมูลลูกหนี้.html'));
});



// บันทึกข้อมูลลูกหนี้
app.post('/Adddebtorinformation/submit', upload.fields([
    { name: 'id_card_photo', maxCount: 1 },
    { name: 'current_address_map', maxCount: 1 },
    { name: 'work_address_map', maxCount: 1 }
]), async (req, res) => {
    try {
        const debtorInf = {
            date: req.body.date,
            id_card_number: req.body.id_card_number,
            fname: req.body.fname,
            lname: req.body.lname,
            ig: req.body.ig,
            facebook: req.body.facebook,
            line: req.body.line,
            phone: req.body.phone,
            monthlyIncome: req.body.monthly_income,
            occupation: req.body.occupation,
            grade: req.body.grade,
            course: req.body.course,
            province: req.body.province,
            currentAddress: req.body.current_address,
            workOrStudyAddress: req.body.work_or_study_address,
            seizableAssets: req.body.seizable_assets,
            storeAssets: req.body.store_assets,
            id_card_photo: req.files['id_card_photo'] ? req.files['id_card_photo'][0].path : '',
            current_address_map: req.files['current_address_map'] ? req.files['current_address_map'][0].path : '',
            work_address_map: req.files['work_address_map'] ? req.files['work_address_map'][0].path : ''
        };
        
        // ตรวจสอบว่ามีข้อมูลลูกหนี้ที่มี id_card_number ตรงกับที่ส่งมาหรือไม่
        const existingDebtor = await DebtorInformation.findOne({ id_card_number: req.body.id_card_number });

        // ถ้ามีข้อมูลลูกหนี้ที่มี id_card_number ตรงกับที่ส่งมา
        if (existingDebtor) {
            // อัปเดตข้อมูลลูกหนี้
            await DebtorInformation.findOneAndUpdate(
                { id_card_number: req.body.id_card_number },
                debtorInf,
                { new: true }
            );
        } else {
            // สร้างข้อมูลลูกหนี้ใหม่
            await new DebtorInformation(debtorInf).save();
        }

        res.redirect('/ข้อมูลลูกหนี้.html');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/บันทึกข้อมูลลูกหนี้.html');
    }
});










// บันทึกสัญญา
app.post('/AddLoanInformation/submit', upload.fields([
    { name: 'asset_receipt_photo', maxCount: 1 },
    { name: 'icloud_asset_photo', maxCount: 1 },
    { name: 'refund_receipt_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        // สร้างข้อมูล LoanInformation ใหม่
        const loanInfo = new LoanInformation({
            loanDate: req.body.loanDate,
            loanPeriod: req.body.loanPeriod,
            returnDate: req.body.returnDate,
            principal: req.body.principal,
            interestRate: req.body.interestRate,
            totalInterest: req.body.totalInterest,
            totalRefund: req.body.totalRefund,
            storeAssets: req.body.store_assets,
            icloudAssets: req.body.icloud_assets,
            assetReceiptPhoto: req.files['asset_receipt_photo'] ? req.files['asset_receipt_photo'][0].path : '',
            icloudAssetPhoto: req.files['icloud_asset_photo'] ? req.files['icloud_asset_photo'][0].path : '',
            refundReceiptPhoto: req.files['refund_receipt_photo'] ? req.files['refund_receipt_photo'][0].path : ''
        });

        // บันทึกข้อมูล LoanInformation
        const savedLoan = await loanInfo.save();

        // เพิ่ม Loan ID ใน DebtorInformation
        await DebtorInformation.updateOne(
            { _id: req.body.user_id }, // หาผู้ใช้งานที่ต้องการอัปเดต
            { $push: { loans: savedLoan._id } } // เพิ่ม Loan ID ในฟิลด์ loans
        );

        res.redirect('/สัญญา.html');
    } catch (err) {
        res.status(500).send(err.message);
        res.redirect('/บันทึกสัญญา.html');
    }
});








// กำหนดพอร์ตที่เซิร์ฟเวอร์จะใช้
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
