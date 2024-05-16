const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // เรียกใช้โมดูล path
const app = express();
const router = express.Router(); // ต้องเพิ่มเพื่อให้สามารถใช้ router ได้
const multer = require('multer');
const { DebtorInformation, LoanInformation } = require('./models'); // Assuming you saved the schema in 'models.js'



// กำหนดการใช้งาน bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // เพิ่ม middleware เพื่อให้ Express.js สามารถอ่านข้อมูลจาก form ได้
// ตั้งค่าให้ Express ให้บริการไฟล์สแตติกจากโฟลเดอร์ 'views'
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




router.get('/debtors', async (req, res) => {
    try {
        const debtors = await DebtorInformation.find(); // Retrieve all debtors from MongoDB
        res.render('debtors', { debtors: debtors }); // Render the debtors template and pass the debtors data to it
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;





// Route เพื่อดึงข้อมูลลูกหนี้จาก MongoDB และส่งไปยังหน้า HTML
router.get('/debtors', async (req, res) => {
    try {
        const debtors = await DebtorInformation.find();
        res.render('debtors', { debtors: debtors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/', router); // เชื่อม Route กับ Express Application







//เปิดหน้าเริ่มต้น
// เส้นทาง GET เพื่อส่งไฟล์ HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ข้อมูลลูกหนี้.html'));
});






//บันทึกข้อมูลลูกหนี้
app.post('/Adddebtorinformation/submit', async (req, res) => {
    try {
        const update = {
            date: req.body.date,
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
            storeAssets: req.body.store_assets
        };

        // Update the debtor information if id_card exists, otherwise create a new entry
        await DebtorInformation.findOneAndUpdate(
            { id_card: req.body.id_card },  // Find document with this id_card
            update,                         // Update the document with this data
            { upsert: true, new: true }     // Create a new document if not found
        );

        await debtorInfo.save();// หลังจากบันทึกข้อมูลเสร็จสามารถเรียกหน้าดูข้อมูลลูกหนี้ทั้งหมดได้ทันที
        res.redirect('/ข้อมูลลูกหนี้.html');
    } catch (err) {
        res.status(500).send(err);
        res.redirect('/บันทึกข้อมูลลูกหนี้.html');
    }
});






// บันทึกสัญญา
app.post('/AddLoanInformation/submit', upload.fields([
    { name: 'asset_receipt_photo', maxCount: 1 },
    { name: 'icloud_asset_photo', maxCount: 1 },
    { name: 'refund_receipt_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        const loanInfo = new LoanInformation({
            loanDate: req.body.loanDate,
            loanPeriod: req.body.loanPeriod,
            returnDate: req.body.returnDate,
            principal: req.body.principal,
            interestRate: req.body.interestRate,
            totalInterest: req.body.totalInterest,
            totalRefund: req.body.totalRefund,
            storeAssets: req.body.store_assets,
            icloudAssets: req.body.icloud_assets, // เพิ่มฟิลด์นี้
            assetReceiptPhoto: req.files['asset_receipt_photo'] ? req.files['asset_receipt_photo'][0].path : '',
            icloudAssetPhoto: req.files['icloud_asset_photo'] ? req.files['icloud_asset_photo'][0].path : '',
            refundReceiptPhoto: req.files['refund_receipt_photo'] ? req.files['refund_receipt_photo'][0].path : ''
        });

        await loanInfo.save();
        res.redirect('/สัญญา.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});






// เส้นทางเพื่อดึงข้อมูลลูกหนี้
app.get('/debtors', async (req, res) => {
    try {
        const debtors = await DebtorInformation.find();
        res.render('debtors', { debtors: debtors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});





// กำหนดพอร์ตที่เซิร์ฟเวอร์จะใช้
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
