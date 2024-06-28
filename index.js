const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const cors = require('cors');
const { DebtorInformation, LoanInformation, Refund, ProfitSharing, Manager, Seizure, Sale  } = require('./models'); // Assuming you saved the schema in 'models.js'



// กำหนดการใช้งาน bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs'); // สำหรับใช้งาน EJS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    { name: 'id_card_photo2', maxCount: 1 },
    { name: 'current_address_map', maxCount: 1 },
    { name: 'work_address_map', maxCount: 1 },
    { name: 'student_record_photo', maxCount: 1 },
    { name: 'timetable_photo', maxCount: 1 }

]), async (req, res) => {
    try {
        const debtorInf = {
            manager: req.body.manager,
            manager2: req.body.manager2,
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
            workOrStudyAddress2: req.body.workOrStudyAddress2,
            id_card_photo: req.files['id_card_photo'] ? req.files['id_card_photo'][0].path : '',
            id_card_photo2: req.files['id_card_photo2'] ? req.files['id_card_photo2'][0].path : '',
            current_address_map: req.files['current_address_map'] ? req.files['current_address_map'][0].path : '',
            work_address_map: req.files['work_address_map'] ? req.files['work_address_map'][0].path : '',
            student_record_photo: req.files['student_record_photo'] ? req.files['student_record_photo'][0].path : '',
            timetable_photo: req.files['timetable_photo'] ? req.files['timetable_photo'][0].path : ''
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



//ส่งข้อมูลไปตารางลูกหนี้
app.get('/api/debtor-data', async (req, res) => {
    try {
        const data = await DebtorInformation.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//ส่งค่าชื่อเเอดมิน
app.get('/api/managers', async (req, res) => {
    try {
      const managers = await Manager.find({}, 'nickname'); // ดึงเฉพาะฟิลด์ nickname
      res.json(managers);
    } catch (err) {
      res.status(500).send(err);
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
    { name: 'id_card_photo2', maxCount: 1 },
    { name: 'current_address_map', maxCount: 1 },
    { name: 'work_address_map', maxCount: 1 },
    { name: 'student_record_photo', maxCount: 1 },
    { name: 'timetable_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        const debtorInf = req.body;
        const updateFields = {
            manager: debtorInf.manager,
            manager2: debtorInf.manager2,
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
            workOrStudyAddress2: debtorInf.workOrStudyAddress2,
            grade: debtorInf.grade,
            course: debtorInf.course,
        };

        // อัปเดตไฟล์ถ้ามีการอัปโหลดใหม่
        if (req.files['id_card_photo']) {
            updateFields.id_card_photo = req.files['id_card_photo'][0].path;
        }
        if (req.files['id_card_photo2']) {
            updateFields.id_card_photo2 = req.files['id_card_photo2'][0].path;
        }
        if (req.files['current_address_map']) {
            updateFields.current_address_map = req.files['current_address_map'][0].path;
        }
        if (req.files['work_address_map']) {
            updateFields.work_address_map = req.files['work_address_map'][0].path;
        }
        if (req.files['student_record_photo']) {
            updateFields.student_record_photo = req.files['student_record_photo'][0].path;
        }
        if (req.files['timetable_photo']) {
            updateFields.timetable_photo = req.files['timetable_photo'][0].path;
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




// ลบข้อมูลลูกหนี้ตาม ID
app.delete('/api/delete-debtor/:id', async (req, res) => {
    const debtorId = req.params.id;

    try {
        // ค้นหาและลบข้อมูลลูกหนี้ตาม ID
        const deletedDebtor = await DebtorInformation.findByIdAndDelete(debtorId);

        if (!deletedDebtor) {
            return res.status(404).json({ error: 'Debtor not found' });
        }

        // ลบข้อมูลการคืนเงินที่เชื่อมโยงกับลูกหนี้นี้
        await Refund.deleteMany({ debtor: debtorId });

        // ลบข้อมูลเงินกู้ที่เชื่อมโยงกับลูกหนี้นี้
        await LoanInformation.deleteMany({ debtor: debtorId });

        // ลบข้อมูลอื่นๆ ที่เชื่อมโยงกับลูกหนี้นี้ (เพิ่มตามความจำเป็น)
        // ...

        res.status(200).json({ message: 'Debtor and related data deleted successfully' });
    } catch (err) {
        console.error('Error deleting debtor:', err);
        res.status(500).json({ error: 'Failed to delete debtor and related data' });
    }
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


//บันทึกสัญญา
app.post('/AddLoanInformation/submit', upload.fields([
    { name: 'asset_receipt_photo', maxCount: 1 },
    { name: 'icloud_asset_photo', maxCount: 1 },
    { name: 'refund_receipt_photo', maxCount: 1 },
    { name: 'Recommended_photo', maxCount: 1 },
    { name: 'contract', maxCount: 1 }
]), async (req, res) => {
    try {
        const idCardNumber = req.body.id_card_number;

        if (!idCardNumber) {
            console.error('ID card number is required');
            return res.status(400).json({ error: 'ID card number is required' });
        }

        console.log('Searching for debtor with ID card number:', idCardNumber);
        const debtor = await DebtorInformation.findOne({ id_card_number: idCardNumber });
        if (!debtor) {
            console.error('Debtor not found');
            return res.status(404).json({ error: 'Debtor not found' });
        }

        console.log('Debtor found:', debtor);

        const loanInfo = new LoanInformation({
            manager: req.body.manager,
            id_card_number: idCardNumber,
            fname: req.body.fname,
            lname: req.body.lname,
            contract_number: req.body.contract_number,
            bill_number: req.body.bill_number || "1",
            loanDate: req.body.loanDate,
            loanPeriod: req.body.loanPeriod,
            returnDate: req.body.returnDate,
            principal: req.body.principal,
            interestRate: req.body.interestRate,
            totalInterest: req.body.totalInterest,
            totalRefund: req.body.totalRefund,
            manager2: req.body.manager2,
            Recommended: req.body.Recommended,
            storeAssets: req.body.store_assets,
            icloudAssets: req.body.icloud_assets,
            phoneicloud: req.body.phoneicloud,
            email_icloud: req.body.email_icloud,
            code_icloud: req.body.code_icloud,
            assetReceiptPhoto: req.files['asset_receipt_photo'] ? req.files['asset_receipt_photo'][0].path : '',
            icloudAssetPhoto: req.files['icloud_asset_photo'] ? req.files['icloud_asset_photo'][0].path : '',
            refundReceiptPhoto: req.files['refund_receipt_photo'] ? req.files['refund_receipt_photo'][0].path : '',
            Recommended_photo: req.files['Recommended_photo'] ? req.files['Recommended_photo'][0].path : '',
            contract: req.files['contract'] ? req.files['contract'][0].path : '',
            debtor: debtor._id
        });

        console.log('Saving loan information...');
        const savedLoan = await loanInfo.save();
        console.log('Loan information saved successfully:', savedLoan);

        console.log('Updating debtor information...');
        await DebtorInformation.updateOne(
            { _id: debtor._id },
            { $push: { loans: savedLoan._id } }
        );
        console.log('Debtor information updated successfully');

        console.log('Calling calculate-and-save endpoint...');
        const response = await fetch('http://localhost:3000/api/calculate-and-save', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_card_number: idCardNumber })
        });


        if (!response.ok) {
            const responseText = await response.text();
            throw new Error(`Error calculating and saving loan data: ${responseText}`);
        }

        const data = await response.json();
        console.log('Calculation and saving loan data successful:', data);

        const redirectURL = `/สัญญา.html?id_card_number=${idCardNumber}&fname=${req.body.fname}&lname=${req.body.lname}&manager=${req.body.manager}&manager2=${req.body.manager2}`;
        res.redirect(redirectURL);

    } catch (err) {
        console.error('Error occurred while saving loan information:', err);
        res.status(500).json({ error: 'An error occurred while saving loan information' });
    }
});



//คำนวณหน้าสัญญา
async function calculateLoanData(loan, currentDate) {
    try {
        const returnDate = new Date(loan.returnDate);

        // คำนวณจำนวนวันถึงวันคืนเงิน (totalRepayment)
        let totalRepayment = Math.round((returnDate - currentDate) / (1000 * 60 * 60 * 24));
        if (totalRepayment <= 0) {
            totalRepayment = '-';
        }

        // คำนวณจำนวนวันที่เลยวันคืนเงิน (daysUntilReturn)
        let daysUntilReturn = Math.round((currentDate - returnDate) / (1000 * 60 * 60 * 24));
        if (daysUntilReturn <= 0) {
            daysUntilReturn = '-';
        }

        // คำนวณดอกเบี้ยปรับปรุง (totalInterest2)
        let totalInterest2 = daysUntilReturn !== '-' ? daysUntilReturn * loan.principal * loan.interestRate / 100 : 0;

        // คำนวณดอกเบี้ยรวม (totalInterest4)
        let totalInterest4 = Number(loan.totalInterest) + Number(totalInterest2) + Number(loan.totalInterest3 || 0);

        // คำนวณเงินที่ต้องคืนทั้งหมด (totalRefund)
        let totalRefund = Number(loan.principal) + Number(totalInterest4);

        // ตรวจสอบและอัปเดตสถานะการคืนเงิน
        const refunds = await Refund.find({ contract_number: loan.contract_number, bill_number: loan.bill_number });

        let status;

        if (refunds.length > 0) {
            const refund = refunds[0];
            
            console.log("Refund.total_refund2: ", refund.total_refund2); // ตรวจสอบค่าของ refund.total_refund2
            console.log("Loan.totalRefund: ", totalRefund); // ตรวจสอบค่าของ totalRefund

            if (refund.total_refund2 >= totalRefund) {
                status = "<span style='color: green;'>ชำระครบ</span>";
            } else {
                status = "<span style='color: green;'>ต่อดอก</span>";
            }
        } else {
            // กำหนดสถานะของสัญญาตามวัน
            if (currentDate > returnDate) {
                status = "<span style='color: orange;'>เลยสัญญา</span>";
            } else if (currentDate < returnDate) {
                status = "<span style='color: blue;'>อยู่ในสัญญา</span>";
            } else if (currentDate === returnDate) {
                status = "<span style='color: pink;'>ครบสัญญา</span>";
            }
        }

        const updatedLoanData = {
            totalRepayment,
            daysUntilReturn,
            totalInterest2,
            totalInterest3: loan.totalInterest3 || 0,
            status,
            totalRefund,
            principal: loan.principal,
            totalInterest4
        };

        // อัปเดตข้อมูลในฐานข้อมูล
        await LoanInformation.updateOne(
            { _id: loan._id },
            { $set: updatedLoanData }
        );

        return {
            ...loan._doc,
            ...updatedLoanData
        };
    } catch (error) {
        console.error('Error occurred while calculating loan data:', error.message);
        throw error;
    }
}







//สำหรับการคำนวณและบันทึกข้อมูลที่คำนวณลงในฐานข้อมูล
app.post('/api/calculate-and-save', async (req, res) => {
    try {
        const idCardNumber = req.body.id_card_number;
        const loans = await LoanInformation.find({ id_card_number: idCardNumber });
        const currentDate = new Date();

        const loanDataWithCalculations = await Promise.all(loans.map(async (loan) => {
            return await calculateLoanData(loan, currentDate);
        }));

        res.json(loanDataWithCalculations);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการคำนวณและบันทึกข้อมูล:', error.message);
        res.status(500).json({ error: 'An error occurred while calculating and saving loan data' });
    }
});


// รับข้อมูลสัญญาเพื่อคำนวณสัญญาก่อนส่งไปหน้าสัญา
app.get('/api/loan-data', async (req, res) => {
    try {
        const idCardNumber = req.query.id_card_number;
        const loans = await LoanInformation.find({ id_card_number: idCardNumber}).sort({contract_number:-1, bill_number:-1});
        const currentDate = new Date();

        // คำนวณข้อมูลเพิ่มเติมก่อนส่งไปยังไคลเอนต์
        const loanDataWithCalculations = await Promise.all(loans.map(async (loan) => {
            return await calculateLoanData(loan, currentDate);
        }));

        res.json(loanDataWithCalculations);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching loan data' });
    }
});

// ส่งข้อมูลสัญญาล่าสุดไปหน้าข้อมูลลูกหนี้
app.get('/api/loaninformations/:debtorId', async (req, res) => {
    const debtorId = req.params.debtorId;
    try {
        const latestLoan = await LoanInformation.findOne({ debtor: debtorId }).sort({ contract_number: -1, bill_number: -1 });
        res.json(latestLoan);
    } catch (error) {
        console.error('Error fetching loan information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//ส่งข้อมูลเงินต้นสะสมไปหน้าลูกหนี้
app.get('/api/loan-principal-sum/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;
        console.log('idCardNumber:', idCardNumber);  // Debug id_card_number

        const loans = await LoanInformation.aggregate([
            { $match: { id_card_number: idCardNumber, bill_number: '1' } }, // กำหนดเงื่อนไข
            { $group: { _id: null, totalPrincipal: { $sum: { $toDouble: "$principal" } } } }
        ]);
        console.log('Loans:', loans);  // Debug loans

        const totalPrincipal = loans.length > 0 ? loans[0].totalPrincipal : 0;
        res.json({ totalPrincipal });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
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





























// บันทึกคืนเงิน
app.post('/refunds/submit_form', upload.single('refund_receipt_photo'), async (req, res) => {
    try {
        const {
            manager,
            id_card_number,
            fname,
            lname,
            contract_number,
            bill_number,
            principal,
            totalInterest4,
            totalRefund,
            return_date,
            refund_principal,
            refund_interest,
            total_refund2,
            debtAmount,
            loan
        } = req.body;

        if (!manager || !id_card_number || !fname || !lname || !contract_number || !bill_number || !principal || !totalInterest4 || !totalRefund || !return_date || !refund_principal || !refund_interest || !total_refund2 || !debtAmount) {
            return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        const totalInterest4Rounded = Math.round(parseFloat(totalInterest4));
        const refundInterestRounded = Math.round(parseFloat(refund_interest));
        const totalRefundRounded = Math.round(parseFloat(totalRefund));
        const refundPrincipalRounded = Math.round(parseFloat(refund_principal));
        const totalRefund2Rounded = Math.round(parseFloat(total_refund2));
        const debtAmountRounded = Math.round(parseFloat(debtAmount));

        const totalInterest5 = calculateTotalInterest5({
            totalInterest4: totalInterest4Rounded,
            refund_interest: refundInterestRounded
        });
        console.log(contract_number,bill_number)
        const refund = new Refund({
            manager,
            id_card_number,
            fname,
            lname,
            contract_number,
            bill_number,
            principal: Math.round(parseFloat(principal)),
            totalInterest4: totalInterest4Rounded,
            totalInterest5: Math.round(totalInterest5),
            totalRefund: totalRefundRounded,
            return_date,
            refund_principal: refundPrincipalRounded,
            refund_interest: refundInterestRounded,
            total_refund2: totalRefund2Rounded,
            debtAmount: debtAmountRounded,
            refund_receipt_photo: req.file ? req.file.path : '',
            loan
        });
        // console.log(refund)

        const savedRefund = await refund.save();

        const initial_profit = await calculateInitialProfitAfterSaving(id_card_number, savedRefund);
        savedRefund.initial_profit = initial_profit;
        await savedRefund.save();

        if (totalRefund2Rounded < totalRefundRounded) {
            const loan = await LoanInformation.findOne({ id_card_number,contract_number }).sort({contract_number:-1, bill_number: -1 });
            // console.log("🚀 ~ app.post ~ loan:", loan)

            if (!loan) {
                throw new Error('ไม่พบข้อมูลสัญญา');
            }

            const newReturnDate = new Date(refund.return_date);
            newReturnDate.setDate(newReturnDate.getDate() + parseInt(loan.loanPeriod));
            const totalInterest5 = totalInterest4Rounded - refundInterestRounded;

            const year = newReturnDate.getFullYear();
            const month = String(newReturnDate.getMonth() + 1).padStart(2, '0');
            const day = String(newReturnDate.getDate()).padStart(2, '0');
            const newReturnDateString = `${year}-${month}-${day}`;

            const loanData = await calculateLoanData(loan, newReturnDate);

            const newLoanData = {
                manager: loan.manager,
                id_card_number: loan.id_card_number,
                fname: loan.fname,
                lname: loan.lname,
                contract_number: loan.contract_number,
                bill_number: parseInt(loan.bill_number) + 1,
                loanDate: refund.return_date,
                loanPeriod: loan.loanPeriod,
                returnDate: newReturnDateString,
                principal: loan.principal - refundPrincipalRounded,
                interestRate: loan.interestRate,
                totalInterest: Math.round(((loan.principal - refundPrincipalRounded) * loan.loanPeriod * loan.interestRate) / 100),
                totalInterest2: Math.round(loanData.daysUntilReturn * (loan.principal - refundPrincipalRounded) * loan.interestRate / 100),
                totalInterest3: Math.round(totalInterest5),
                totalInterest4: Math.round(((loan.principal - refundPrincipalRounded) * loan.loanPeriod * loan.interestRate) / 100 +
                                loanData.daysUntilReturn * (loan.principal - refundPrincipalRounded) * loan.interestRate / 100 +
                                totalInterest5),
                totalRefund: Math.round((loan.principal - refundPrincipalRounded) +
                                ((loan.principal - refundPrincipalRounded) * loan.loanPeriod * loan.interestRate) / 100 +
                                loanData.daysUntilReturn * (loan.principal - refundPrincipalRounded) * loan.interestRate / 100 +
                                totalInterest5),
                totalRepayment: loanData.totalRepayment,
                daysUntilReturn: loanData.daysUntilReturn,
                status: loanData.status,
                debtor: loan.debtor
            };

            const newLoan = new LoanInformation(newLoanData);
            const savedNewLoan = await newLoan.save();

            console.log('New Loan Data Saved:', savedNewLoan);
        }

        const redirectURL = `/คืนเงิน.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}`;
        res.status(302).redirect(redirectURL);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึก Refund:', error.message);
        res.status(500).send('เกิดข้อผิดพลาดในการบันทึก Refund');
    }
});




// ดอกเบี้ยค้าง
function calculateTotalInterest5({ totalInterest4, refund_interest }) {
    const totalInterest5 = Math.round(totalInterest4 - refund_interest);
    return totalInterest5 < 0 ? 0 : totalInterest5;
}




// ส่วนที่ต้องแบ่ง
async function calculateInitialProfitAfterSaving(id_card_number, currentRefund) {
    try {
        // ดึงข้อมูล refunds ที่เพิ่งถูกบันทึกเสร็จแล้ว
        const refunds = await Refund.find({ id_card_number });

        if (!refunds || refunds.length === 0) {
            console.log('No refunds found or refunds array is empty');
            return 0; // หรือค่าเริ่มต้นตามที่คุณต้องการให้กลับมา
        }

        // รวมค่า total_refund2 ของบิลที่มี id_card_number เหมือนกัน
        const total_refund2_sum = refunds
            .filter(refund => refund.id_card_number === id_card_number)
            .reduce((sum, refund) => sum + Math.round(parseFloat(refund.total_refund2)), 0);

        // หา principal ของบิลที่เท่ากับ 1 ที่มี id_card_number เหมือนกัน
        const principal_bill_1_refund = refunds.find(refund => refund.bill_number === '1' && refund.id_card_number === id_card_number);
        const principal_bill_1 = principal_bill_1_refund ? Math.round(parseFloat(principal_bill_1_refund.principal)) : 0;

        // คำนวณ initial profit โดยใช้ total_refund2_sum หักด้วย principal ของบิลที่ 1
        let initial_profit = Math.round(total_refund2_sum - principal_bill_1);

        // ถ้า initial_profit เป็นบวก ให้ลบ initial_profit ที่มีค่าเป็นบวกของรายการที่มี contract_number เหมือนกันและ bill_number น้อยกว่า bill_number ของรายการปัจจุบัน
        console.log("🚀 ~ calculateInitialProfitAfterSaving ~ initial_profit:", initial_profit)
        if (initial_profit > 0) {
            const currentBillNumber = parseInt(principal_bill_1_refund.bill_number);
            let total_initial_profit_befor = 0
            for (let i=0;i < (refunds.length-1);i++) {
                let refund = refunds[i]
                if (refund.initial_profit && parseInt(refund.initial_profit)>0){
                    total_initial_profit_befor += parseInt(refund.initial_profit)
                }
            }
            // let refund = refunds[refunds.length-1]
            // console.log((initial_profit - total_initial_profit_befor))
            initial_profit = (initial_profit - total_initial_profit_befor)
            // await refund.save()
                
            // ตั้งค่า status เป็น "ยังไม่แบ่ง" สำหรับ currentRefund ที่มี initial_profit เป็นบวก
            currentRefund.status = '<span style="color: orange;">ยังไม่แบ่ง</span>';
                } else {
            // ตรวจสอบและตั้งค่า status เป็น "ไม่ควรแบ่ง" สำหรับ currentRefund ที่มี initial_profit เป็นลบ
            currentRefund.status = '<span style="color: red;">ไม่ควรเเบ่ง</span>';
        }

        await currentRefund.save();

        // ใส่ console.log เพื่อตรวจสอบค่า
        console.log('Total Refund2 Sum:', total_refund2_sum);
        console.log('Principal Bill 1:', principal_bill_1);
        console.log('Initial Profit:', initial_profit);

        return initial_profit; // คืนค่าเป็นตัวเลขที่คำนวณได้
    } catch (error) {
        console.error('Error fetching refunds:', error.message);
        return 0; // หรือค่าเริ่มต้นตามที่คุณต้องการให้กลับมา
    }
}



//ส่งสัญญาใหม่ไปตารางสัญญา
app.get('/new-contracts', async (req, res) => {
    try {
        // ค้นหาข้อมูลสัญญาใหม่ทั้งหมดจากฐานข้อมูล
        const newContracts = await LoanInformation.find({ status: 'new' });

        // ส่งข้อมูลสัญญาใหม่ทั้งหมดกลับไปยังหน้าเว็บไซต์
        res.status(200).json(newContracts);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสัญญาใหม่:', error);5
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสัญญาใหม่');
    }
});


//ส่งข้อมูลคินเงินไปหน้าคืนเงิน
app.get('/api/refunds/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;
        const refunds = await Refund.find({ id_card_number: idCardNumber }).populate('loan');
        res.json(refunds);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Refund:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล Refund');
    }
});


//ส่งดอกเบี้ยสะสมไปหน้าลูกหนี้
app.get('/api/refund-interest-sum/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;
        const refunds = await Refund.aggregate([
            { $match: { id_card_number: idCardNumber } }, // กำหนดเงื่อนไข
            { $group: { _id: null, totalRefundInterest: { $sum: { $toDouble: "$refund_interest" } } } }
        ]);

        const totalRefundInterest = refunds.length > 0 ? refunds[0].totalRefundInterest : 0;
        res.json({ totalRefundInterest });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err);
    }
});


// ลบคืนเงิน
app.delete('/api/refunds/:refundId', async (req, res) => {
    try {
        const refundId = req.params.refundId;
        // ค้นหาและลบ Refund โดยใช้ ID
        const deletedRefund = await Refund.findByIdAndDelete(refundId);
        if (!deletedRefund) {
            // ถ้าไม่พบ Refund ที่ต้องการลบ
            return res.status(404).json({ error: 'ไม่พบข้อมูลการคืนเงิน' });
        }
        // ส่งข้อความยืนยันการลบกลับไป
        res.json({ message: 'ลบข้อมูลการคืนเงินเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error.message);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
});


















// บันทึกส่วนแบ่ง
app.post('/profit-sharing', upload.fields([
    { name: 'collector_receipt_photo', maxCount: 1 },
    { name: 'manager_receipt_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            manager,
            id_card_number,
            fname,
            lname,
            contract_number,
            bill_number,
            return_date_input,
            initial_profit,
            collector_name,
            collector_share,
            initial_profit2,
            manager_name,
            bankName,
            accountNumber,
            manager_share2,
            manager_share,
            total_share,
            net_profit,
            refundId,
            managerId
        } = req.body;

        const collectorReceiptPhoto = req.files['collector_receipt_photo'] ? req.files['collector_receipt_photo'][0].path : null;
        const managerReceiptPhoto = req.files['manager_receipt_photo'] ? req.files['manager_receipt_photo'][0].path : null;

        // แปลง refundId เป็น ObjectId
        const ObjectId = require('mongoose').Types.ObjectId;
        const refundObjectId = new ObjectId(refundId);

        // ค้นหา Refund document โดยใช้ refundId
        const refundDoc = await Refund.findById(refundObjectId);
        if (!refundDoc) {
            console.log("Refund not found!");
            return res.status(404).json({ message: 'Refund not found' });
        }

        const profitSharing = new ProfitSharing({
            manager,
            id_card_number: id_card_number,
            fname: fname,
            lname: lname,
            contract_number: contract_number,
            bill_number: bill_number,
            returnDate: return_date_input,
            initialProfit: parseFloat(initial_profit),
            collectorName: collector_name,
            collectorShare: parseFloat(collector_share) || null,
            initialProfit2: parseFloat(initial_profit2),
            managerName: manager_name,
            bankName: bankName, 
            accountNumber: accountNumber, 
            manager_share2: manager_share2,
            managerShare: parseFloat(manager_share) || null,
            totalShare: parseFloat(total_share) || null,
            netProfit: parseFloat(net_profit),
            collectorReceiptPhoto,
            managerReceiptPhoto,
            refund: refundObjectId
        });

        await profitSharing.save();

        // เปลี่ยนสถานะของ Refund เป็น "เเบ่งเเล้ว"
        refundDoc.status = '<span style="color: green;">เเบ่งเเล้ว</span>';
        await refundDoc.save();

        res.redirect(`/ส่วนเเบ่ง.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});





//ส่งข้อมูลไปหน้าส่วนเเบ่ง
app.get('/get-profit-sharing-data/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;

        // Find profit sharing data based on id_card_number from the database
        const profitSharingData = await ProfitSharing.find({ id_card_number: idCardNumber });

        // Send the profit sharing data as JSON response
        res.json(profitSharingData);
    } catch (error) {
        // If there is an error, send a 500 status code with an error message
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});




// ลบข้อมูลส่วนแบ่ง
app.delete('/api/delete-profit-sharing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { id_card_number } = req.query;

        // ลบข้อมูลส่วนแบ่งจากฐานข้อมูล
        const deletedProfitSharing = await ProfitSharing.findByIdAndDelete(id);

        if (!deletedProfitSharing) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Profit sharing data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});








// บันทึกข้อมูลเเอดมิน
app.post('/submit', async (req, res) => {
    const managerInstance = new Manager({
      record_date: req.body.record_date,
      id_card_number: req.body.id_card_number,
      bankName: req.body.bankName,
      accountNumber: req.body.accountNumber,
      fname: req.body.fname,
      lname: req.body.lname,
      nickname: req.body.nickname,
      phone: req.body.phone,
      ig: req.body.ig,
      facebook: req.body.facebook,
      line: req.body.line
      
    });
  
    try {
      await managerInstance.save();
      res.redirect('/เเอดมิน.html');
    } catch (error) {
      res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
});





// ส่งข้อมูลเเอดมินไปยังหน้าเเอดมิน
app.get('/api/managersList', async (req, res) => {
    try {
        const managers = await Manager.find();
        console.log("🚀 ~ app.get ~ managers:", managers)
        console.log('Managers:', managers); // ตรวจสอบข้อมูลที่ดึงมา
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเเอดมิน' });
    }
});



// ลบข้อมูลเเอดมิน
app.delete('/api/managers/:id', async (req, res) => {
    const managerId = req.params.id;
    try {
        const deletedManager = await Manager.findByIdAndDelete(managerId);
        if (!deletedManager) {
            return res.status(404).json({ message: 'ไม่พบผู้จัดการที่ต้องการลบ' });
        }
        res.json({ message: 'ลบข้อมูลผู้จัดการเรียบร้อยแล้ว' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้จัดการ' });
    }
});









//บันทึกยึดทรัพย์
app.post('/api/seize-assets', upload.single('assetPhoto'), (req, res) => {
    const { id_card_number, contract_number, bill_number, seizureDate, principal, seizureCost, totalproperty, assetName, assetDetails } = req.body;
    const assetPhoto = req.file ? req.file.path : '';
  
    const newSeizure = new Seizure({
      id_card_number,
      contract_number,
      bill_number,
      seizureDate,
      principal,
      seizureCost,
      totalproperty,
      assetName,
      assetDetails,
      assetPhoto
    });
  
    newSeizure.save()
      .then(() => res.redirect('/คลังทรัพย์สิน.html'))
      .catch((err) => res.status(400).send(`Error: ${err.message}`));
});


// ส่งข้อมูลไปหน้าคลังทรัพย์สิน
app.get('/api/seize-assets', async (req, res) => {
    try {
        const seizures = await Seizure.find();
        res.json(seizures);
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

// ลบข้อมูลทรัพย์สิน
app.delete('/api/seize-assets/:seizureId', async (req, res) => {
    try {
        const seizure = await Seizure.findByIdAndDelete(req.params.seizureId);
        if (!seizure) {
            return res.status(404).send("ไม่พบทรัพย์สินที่ต้องการลบ");
        }
        res.send(seizure);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});




// บันทึกการขายทรัพย์
app.post('/submit-sale', upload.single('sell_slip'), async (req, res) => {
    const { id_card_number, contract_number, bill_number, totalproperty, sell_date, assetName, assetDetails, sellamount, netprofit, seizure_id } = req.body;
    const sell_slip = req.file ? req.file.filename : null;
    
    try {
        // ตรวจสอบว่า seizure_id เป็น ObjectId ที่ถูกต้อง
        if (!mongoose.Types.ObjectId.isValid(seizure_id)) {
            throw new Error('Invalid seizure ObjectId');
        }
    
        // สร้างข้อมูลการขายใหม่
        const newSale = new Sale({
            id_card_number,
            contract_number,
            bill_number,
            totalproperty,
            sell_date,
            assetName,
            assetDetails,
            sellamount,
            netprofit,
            sell_slip,
            seizure_id: seizure_id // เชื่อมต่อกับ ID ของการยึดทรัพย์
        });
    
        // บันทึกข้อมูลการขายลงใน MongoDB
        const savedSale = await newSale.save();
    
        // หาข้อมูลการยึดทรัพย์ที่เกี่ยวข้อง
        const seizure = await Seizure.findById(seizure_id);
    
        if (!seizure) {
            throw new Error('ไม่พบข้อมูลการยึดทรัพย์ที่เกี่ยวข้อง');
        }
    
        // อัพเดทข้อมูลการขายในข้อมูลการยึดทรัพย์
        seizure.status = 'sold'; // ตั้งค่าสถานะการขายในการยึดทรัพย์
        seizure.sale = savedSale._id; // เก็บ ID ของการขายที่เกี่ยวข้องกับการยึดทรัพย์
    
        // บันทึกการเปลี่ยนแปลงลงใน MongoDB
        await seizure.save();
    
        // บันทึกสำเร็จ ให้ redirect ไปยังหน้า "ขายทรัพย์.html"
        res.redirect('/ขายทรัพย์สิน.html');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', err);
        res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
});


//ส่งข้อมูลไปหน้าขายทรัพย์
app.get('/sales', async (req, res) => {
    try {
        // หาข้อมูลการขายทั้งหมดจากฐานข้อมูล
        const sales = await Sale.find().populate('seizure_id');

        // ส่งข้อมูลการขายในรูปแบบ JSON
        res.json(sales);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการขาย:', err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลการขาย');
    }
});



// กำหนดพอร์ตที่เซิร์ฟเวอร์จะใช้
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
