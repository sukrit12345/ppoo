const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const cors = require('cors');
const { DebtorInformation, LoanInformation, Refund } = require('./models'); // Assuming you saved the schema in 'models.js'



// กำหนดการใช้งาน bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs'); // สำหรับใช้งาน EJS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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


// เปิดไฟล์หน้าเเรก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ข้อมูลลูกหนี้.html'));
});   





// บันทึกข้อมูลลุกหนี้
app.post('/Adddebtorinformation/submit', upload.fields([
    { name: 'id_card_photo', maxCount: 1 },
    { name: 'current_address_map', maxCount: 1 },
    { name: 'work_address_map', maxCount: 1 }
]), async (req, res) => {
    try {
        const debtorInf = {
            manager: req.body.manager,
            date: req.body.date,
            id_card_number: req.body.id_card_number,
            fname: req.body.fname,
            lname: req.body.lname,
            occupation: req.body.occupation,
            monthly_income_amount: req.body.monthly_income_amount,
            seizable_assets_description: req.body.seizable_assets_description,
            ig: req.body.ig,
            facebook: req.body.facebook,
            line: req.body.line,
            phone: req.body.phone,
            grade: req.body.grade,
            course: req.body.course,
            province: req.body.province,
            currentAddress: req.body.currentAddress,
            workOrStudyAddress: req.body.workOrStudyAddress,
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


//ดึงข้อมูลจาก DebtorInformation
app.get('/api/debtor-data', async (req, res) => {
    try {
        const data = await DebtorInformation.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//ดึงข้อมูลลูกหนี้ตามid
app.get('/api/debtor/:id', async (req, res) => {
    try {
        const debtor = await DebtorInformation.findById(req.params.id);
        if (!debtor) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลลูกหนี้' });
        }
        res.json(debtor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//เเก้ไขข้อมูลลูกหนี้ตามID
app.put('/api/debtor/:id', upload.fields([
    { name: 'id_card_photo', maxCount: 1 },
    { name: 'current_address_map', maxCount: 1 },
    { name: 'work_address_map', maxCount: 1 }
]), async (req, res) => {
    try {
        const debtorInf = req.body;
        const updateFields = {
            manager: debtorInf.manager,
            date: debtorInf.date,
            id_card_number: debtorInf.id_card_number,
            fname: debtorInf.fname,
            lname: debtorInf.lname,
            occupation: debtorInf.occupation,
            monthly_income_amount: debtorInf.monthly_income_amount,
            seizable_assets_description: debtorInf.seizable_assets_description,
            ig: debtorInf.ig,
            facebook: debtorInf.facebook,
            line: debtorInf.line,
            phone: debtorInf.phone,
            province: debtorInf.province,
            currentAddress: debtorInf.currentAddress,
            workOrStudyAddress: debtorInf.workOrStudyAddress,
            grade: debtorInf.grade,
            course: debtorInf.course,
        };

        // อัปเดตไฟล์ถ้ามีการอัปโหลดใหม่
        if (req.files['id_card_photo']) {
            updateFields.id_card_photo = req.files['id_card_photo'][0].path;
        }
        if (req.files['current_address_map']) {
            updateFields.current_address_map = req.files['current_address_map'][0].path;
        }
        if (req.files['work_address_map']) {
            updateFields.work_address_map = req.files['work_address_map'][0].path;
        }

        const updatedDebtor = await DebtorInformation.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedDebtor) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลลูกหนี้' });
        }
        res.json(updatedDebtor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//ลบข้อมูลลูกหนี้ตาม ID
app.delete('/api/delete-debtor/:id', async (req, res) => {
    const debtorId = req.params.id;

    try {
        // ค้นหาและลบข้อมูลลูกหนี้ตาม ID
        const deletedDebtor = await DebtorInformation.findByIdAndDelete(debtorId);

        if (!deletedDebtor) {
            return res.status(404).json({ error: 'Debtor not found' });
        }

        res.status(200).json({ message: 'Debtor deleted successfully' });
    } catch (err) {
        console.error('Error deleting debtor:', err);
        res.status(500).json({ error: 'Failed to delete debtor' });
    }
});











// บันทึกข้อมูลสัญญา
app.post('/AddLoanInformation/submit', upload.fields([
    { name: 'asset_receipt_photo', maxCount: 1 },
    { name: 'icloud_asset_photo', maxCount: 1 },
    { name: 'refund_receipt_photo', maxCount: 1 },
    { name: 'contract', maxCount: 1 }
]), async (req, res) => {
    try {
        const idCardNumber = req.body.id_card_number;

        if (!idCardNumber) {
            return res.status(400).send('ID card number is required');
        }

        const debtor = await DebtorInformation.findOne({ id_card_number: idCardNumber });
        if (!debtor) {
            return res.status(404).send('Debtor not found');
        }

        const loanInfo = new LoanInformation({
            manager: req.body.manager,
            id_card_number: idCardNumber,
            fname: req.body.fname, // เพิ่มชื่อจริง
            lname: req.body.lname, // เพิ่มนามสกุล
            contract_number: req.body.contract_number,
            bill_number: req.body.bill_number || "1", // กำหนดหมายเลขบิลเป็น 1 หากไม่ได้ระบุมา
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
            refundReceiptPhoto: req.files['refund_receipt_photo'] ? req.files['refund_receipt_photo'][0].path : '',
            contract: req.files['contract'] ? req.files['contract'][0].path : '',
            debtor: debtor._id
          
        });

        const savedLoan = await loanInfo.save();

        await DebtorInformation.updateOne(
            { _id: debtor._id },
            { $push: { loans: savedLoan._id } }
        );

        // Redirect ไปยังหน้าสัญญาพร้อมส่งพารามิเตอร์ id_card_number, fname และ lname
        const redirectURL = `/สัญญา.html?id_card_number=${idCardNumber}&fname=${req.body.fname}&lname=${req.body.lname}&manager=${req.body.manager}`;
        res.redirect(redirectURL);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});





// รับข้อมูลสัญญาผ่าน API
app.get('/api/loan-data', async (req, res) => {
    try {
        const idCardNumber = req.query.id_card_number;
        const loans = await LoanInformation.find({ id_card_number: idCardNumber });
        const currentDate = new Date();

        // คำนวณข้อมูลเพิ่มเติมก่อนส่งไปยังไคลเอนต์
        const loanDataWithCalculations = loans.map(loan => calculateLoanData(loan, currentDate));

        res.json(loanDataWithCalculations);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching loan data' });
    }
});







// ดึงข้อมูลจาก LoanInformation ตาม id_card_number
app.get('/api/loan-data', async (req, res) => {
    try {
        const idCardNumber = req.query.id_card_number;
        const data = await LoanInformation.find({ id_card_number: idCardNumber });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/loan/:loanId', (req, res) => {
    const loanId = req.params.loanId;
    Collection.findOne({ _id: loanId }, (err, loan) => {
        if (err || !loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }
        res.json(loan);
    });
});



// ดึงหมายเลขสัญญาสูงสุดตาม id_card_number จากฐานข้อมูล
app.get('/api/max-contract-number', async (req, res) => {
    try {
        const idCardNumber = req.query.id_card_number;
        if (!idCardNumber) {
            return res.status(400).json({ message: 'id_card_number is required' });
        }
        
        const maxContract = await LoanInformation.findOne({ id_card_number: idCardNumber })
                                               .sort({ contract_number: -1 });
        const maxContractNumber = maxContract ? maxContract.contract_number : 0;
        res.json({ maxContractNumber });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// เเก้ไขสัญญา
app.put('/api/loan/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const id_card_number = req.body.id_card_number;

        // ตรวจสอบว่ามี ID card number และ ID ที่ส่งมา
        if (!id_card_number || !id) {
            return res.status(400).json({ error: 'ID card number and loan ID are required' });
        }

        // ตรวจสอบว่ามีลูกหนี้ที่ตรงกับ ID card number หรือไม่
        const debtor = await DebtorInformation.findOne({ id_card_number });
        if (!debtor) {
            return res.status(404).json({ error: 'Debtor not found' });
        }

        // ตรวจสอบว่ามีสัญญาที่ตรงกับ ID ที่ส่งมาหรือไม่
        const existingLoan = await LoanInformation.findById(id);
        if (!existingLoan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        // ทำการอัปเดตข้อมูลสัญญา
        const updateFields = {
            id_card_number,
            fname: req.body.fname,
            lname: req.body.lname,
            contract_number: req.body.contract_number,
            bill_number: req.body.bill_number,
            loanDate: req.body.loanDate,
            loanPeriod: req.body.loanPeriod,
            returnDate: req.body.returnDate,
            principal: req.body.principal,
            interestRate: req.body.interestRate,
            totalInterest: req.body.totalInterest,
            totalRefund: req.body.totalRefund,
            store_assets: req.body.store_assets,
            icloud_assets: req.body.icloud_assets
            
        };

        // ทำการอัปเดตในฐานข้อมูล
        await LoanInformation.findByIdAndUpdate(id, updateFields);

        res.status(200).json({ message: 'Loan information updated successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// ลบข้อมูลสัญญา
app.delete('/api/delete-loan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await LoanInformation.findByIdAndDelete(id);
        res.json({ message: 'Loan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});









//คำนวณหน้าคืนเงิน
app.get('/api/calculate_interest_profit/:refund_id', async (req, res) => {
    try {
        const refundId = req.params.refund_id;

        // ค้นหาข้อมูล refund จาก ID ที่ให้มา
        const refund = await Refund.findById(refundId);

        if (!refund) {
            return res.status(404).send('Refund not found');
        }

        // ค้นหาข้อมูล loan ที่ตรงกับ id_card_number, contract_number, และ bill_number
        const loan = await LoanInformation.findOne({
            id_card_number: refund.id_card_number,
            contract_number: refund.contract_number,
            bill_number: refund.bill_number
        });

        if (!loan) {
            return res.status(404).send('Loan not found');
        }

        // คำนวณข้อมูลเพิ่มเติมของสัญญา
        const currentDate = new Date();
        const calculatedLoanData = calculateLoanData(loan, currentDate);

        // ดึงค่า totalInterest4 และ principal จากข้อมูลที่คำนวณ
        const totalInterest4 = calculatedLoanData.totalInterest4;
        const principal = loan.principal;

        // คำนวณ totalInterest5 โดยลบค่า refund_interest ออกจาก totalInterest4
        let totalInterest5 = totalInterest4 - refund.refund_interest;

        // ตรวจสอบว่า totalInterest5 เป็นค่าลบหรือศูนย์
        if (totalInterest5 <= 0) {
         totalInterest5 = 0;
        }

        // ค้นหา loan ที่ตรงกับ id_card_number, contract_number และ bill_number = 1
        const initialLoan = await LoanInformation.findOne({
            id_card_number: refund.id_card_number,
            contract_number: refund.contract_number,
            bill_number: '1'
        });

        if (!initialLoan) {
            return res.status(404).send('Initial Loan not found');
        }

        // ค้นหา refunds ทั้งหมดที่มี id_card_number และ contract_number ตรงกัน และ bill_number น้อยกว่าหรือเท่ากับ bill_number ปัจจุบัน
        const allRefunds = await Refund.find({
            id_card_number: refund.id_card_number,
            contract_number: refund.contract_number,
            bill_number: { $lte: refund.bill_number }
        });

        // รวบรวม total_refund ทั้งหมด
        const totalRefundSum = allRefunds.reduce((sum, r) => sum + parseFloat(r.total_refund), 0);

        // คำนวณ initial_profit โดยลบค่า principal ของ initialLoan ออกจาก totalRefundSum
        const initial_profit = totalRefundSum - initialLoan.principal;

        // ส่งข้อมูลที่คำนวณได้กลับเป็น JSON
        res.json({
            totalInterest5,
            initial_profit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});










//บันทึกคืนเงินเเละสัญญาใหม่
app.post('/refunds/submit_form', upload.fields([
    { name: 'refund_receipt_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id_card_number, contract_number, bill_number, manager, fname, lname, return_date, refund_principal, refund_interest, total_refund } = req.body;

        // ค้นหาข้อมูล loan ที่ตรงกับ id_card_number, contract_number, และ bill_number
        const loan = await LoanInformation.findOne({
            id_card_number,
            contract_number,
            bill_number
        });

        // ถ้าไม่พบ loan ที่ตรงกัน ให้ส่ง error
        if (!loan) {
            return res.status(400).send('Loan not found');
        }

        const refundData = {
            manager,
            id_card_number,
            fname,
            lname,
            contract_number,
            bill_number,
            return_date,
            refund_principal: refund_principal || 0, // ตั้งค่าเป็น 0 ถ้า refund_principal เป็นค่าว่าง
            refund_interest,
            total_refund,
            refund_receipt_photo: req.files['refund_receipt_photo'] ? req.files['refund_receipt_photo'][0].path : '',
            loan: loan._id // อ้างอิงถึงไอดีของ loan
        };

        // บันทึกข้อมูลลงในฐานข้อมูล
        const newRefund = new Refund(refundData);
        await newRefund.save();

        // คำนวณ totalInterest5 โดยลบค่า refund_interest ออกจาก totalInterest4
        const calculatedLoanData = calculateLoanData(loan, new Date());
        const totalInterest4 = calculatedLoanData.totalInterest4;
        let totalInterest5 = totalInterest4 - refund_interest;
        if (totalInterest5 < 0) {
        totalInterest5 = 0;
        }

        // คำนวณ totalRefund เป็นผลรวมของ principal และ totalInterest4
        const totalRefund = parseFloat(loan.principal - (refund_principal || 0)) + parseFloat(totalInterest4);



        // ตรวจสอบว่าจำนวนเงินคืนตรงกับ totalRefund หรือไม่
        if (parseFloat(total_refund) === loan.totalRefund) {
            // ไม่ต้องสร้างสัญญาใหม่
            res.redirect(`/คืนเงิน.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}`);
        } else {
            // สร้างข้อมูลสัญญาใหม่
            const newBillNumber = (parseInt(loan.bill_number) + 1).toString();
            const newLoanData = {
                manager: loan.manager,
                id_card_number: loan.id_card_number,
                fname: loan.fname,
                lname: loan.lname,
                contract_number: loan.contract_number,
                bill_number: newBillNumber,
                loanDate: return_date, // ให้วันที่เริ่มสัญญาเท่ากับวันที่คืนเงิน
                loanPeriod: loan.loanPeriod,
                returnDate: new Date(new Date(return_date).getTime() + loan.loanPeriod * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                principal: loan.principal - (refund_principal || 0), // ลบจำนวนเงินที่คืนออกจากเงินหลัก ถ้า refund_principal เป็นค่าว่างให้เท่ากับ 0
                interestRate: loan.interestRate,
                totalInterest: (loan.principal - (refund_principal || 0)) * loan.interestRate * loan.loanPeriod / 100, // คำนวณ totalInterest ใหม่
                totalInterest2: loan.totalInterest2,
                totalInterest3: totalInterest5,
                totalInterest4: totalInterest4,
                totalRefund: totalRefund,
                storeAssets: loan.storeAssets,
                icloudAssets: loan.icloudAssets,
                assetReceiptPhoto: loan.assetReceiptPhoto,
                icloudAssetPhoto: loan.icloudAssetPhoto,
                refundReceiptPhoto: loan.refundReceiptPhoto,
                contract: loan.contract,
                debtor: loan.debtor
            };

            // บันทึกข้อมูลสัญญาใหม่
            const newLoan = new LoanInformation(newLoanData);
            await newLoan.save();

            await DebtorInformation.updateOne(
                { _id: loan.debtor },
                { $push: { loans: newLoan._id } }
            );

            res.redirect(`/คืนเงิน.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/error.html'); // เปลี่ยนเส้นทางการ redirect ตามที่คุณต้องการ
    }
});


//คำนวณหน้าสัญญา
function calculateLoanData(loan, currentDate) {
    const returnDate = new Date(loan.returnDate);

    // คำนวณวันใกล้ถึงสัญญา
    let totalRepayment = Math.round((returnDate - currentDate) / (1000 * 60 * 60 * 24));
    if (totalRepayment <= 0) {
        totalRepayment = '-';
    }

    // คำนวณวันเลยสัญญา
    let daysUntilReturn = Math.round((currentDate - returnDate) / (1000 * 60 * 60 * 24));
    if (daysUntilReturn <= 0) {
        daysUntilReturn = '-';
    }

    // คำนวณดอกปรับ
    let totalInterest2 = daysUntilReturn !== '-' ? Math.round(daysUntilReturn * loan.interestRate * loan.principal / 100) : 0;

    // ถ้าค่า totalInterest2 หรือ totalInterest3 เป็น '-' หรือค่าว่างให้ตั้งค่าเป็น 0
    totalInterest2 = totalInterest2 === '-' || totalInterest2 === '' || totalInterest2 === 'undefined' ? 0 : totalInterest2;

    // คำนวณ Totalreturned โดยไม่รวมค่าที่เป็น '-'
    let totalReturned = Number(loan.principal) + Number(loan.totalInterest) + Number(totalInterest2) + (loan.totalInterest3 !== undefined && loan.totalInterest3 !== null ? Number(loan.totalInterest3) : 0);

    // คำนวณ totalInterest4
    let totalInterest4 = Number(loan.totalInterest) + Number(totalInterest2) + (loan.totalInterest3 !== undefined && loan.totalInterest3 !== null ? Number(loan.totalInterest3) : 0);

    return {
        ...loan._doc,
        totalRepayment,
        daysUntilReturn,
        totalInterest2,
        totalReturned,
        totalInterest4
    };
}











//ดึงข้อมูลการคืนเงินตาม id_card_number
app.get('/api/refunds/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;
        const refunds = await Refund.find({ id_card_number: idCardNumber });

        if (refunds.length === 0) {
            return res.status(404).json({ error: 'Refunds not found' });
        }

        res.json(refunds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});











// กำหนดพอร์ตที่เซิร์ฟเวอร์จะใช้
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
