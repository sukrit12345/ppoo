const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const cors = require('cors');
const { DebtorInformation, LoanInformation, Refund, ProfitSharing, Manager, Seizure, Sale, iCloudRecord, Income, Expense, Capital  } = require('./models'); // Assuming you saved the schema in 'models.js'



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

        // ค้นหา iCloudRecord ที่เกี่ยวข้อง
        const icloudRecords = await iCloudRecord.find({ 
            phone_number: req.body.phoneicloud,
            user_email: req.body.email_icloud
        });

        // ตรวจสอบและแสดงผล iCloudRecords ที่ค้นหาได้
        if (icloudRecords.length === 0) {
            console.log(`No iCloudRecords found with phone_number: ${req.body.phoneicloud} and user_email: ${req.body.email_icloud}`);
        } else {
            console.log(`Found ${icloudRecords.length} iCloudRecords with phone_number: ${req.body.phoneicloud} and user_email: ${req.body.email_icloud}`);
            icloudRecords.forEach(record => console.log(record));
        }

        const loanInfo = new LoanInformation({
            manager: req.body.manager,
            id_card_number: idCardNumber,
            fname: req.body.fname,
            lname: req.body.lname,
            contract_number: req.body.contract_number,
            bill_number: req.body.bill_number || "1",
            loanType: req.body.loanType,
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
            code_icloud2: req.body.code_icloud2,
            assetReceiptPhoto: req.files['asset_receipt_photo'] ? req.files['asset_receipt_photo'][0].path : '',
            icloudAssetPhoto: req.files['icloud_asset_photo'] ? req.files['icloud_asset_photo'][0].path : '',
            refundReceiptPhoto: req.files['refund_receipt_photo'] ? req.files['refund_receipt_photo'][0].path : '',
            Recommended_photo: req.files['Recommended_photo'] ? req.files['Recommended_photo'][0].path : '',
            contract: req.files['contract'] ? req.files['contract'][0].path : '',
            debtor: debtor._id,
            icloud_records: icloudRecords.map(record => record._id) // เพิ่มการอ้างอิง iCloudRecord
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




// คำนวณหน้าสัญญา
async function calculateLoanData(loan, currentDate) {
    try {
        const returnDate = new Date(loan.returnDate);

        let totalRepayment = Math.round((returnDate - currentDate) / (1000 * 60 * 60 * 24));
        if (totalRepayment <= 0) totalRepayment = '-';

        let daysUntilReturn = Math.round((currentDate - returnDate) / (1000 * 60 * 60 * 24));
        if (daysUntilReturn <= 0) daysUntilReturn = '-';

        let totalInterest2 = daysUntilReturn !== '-' ? Math.round(daysUntilReturn * loan.principal * loan.interestRate / 100) : 0;
        let originalTotalInterest2 = totalInterest2;

        const refunds = await Refund.find({ id_card_number: loan.id_card_number, bill_number: loan.bill_number, contract_number: loan.contract_number });
        let status = loan.status; // ใช้สถานะเดิมก่อนการคำนวณ

        const seizure = await Seizure.findOne({ loan: loan._id });

        if (seizure) {
            status = "<span style='color: red;'>ยึดทรัพย์</span>";
            totalRepayment = '-';
            daysUntilReturn = '-';
            totalInterest2 = originalTotalInterest2;
            totalRefund = Math.round(Number(loan.principal) + Number(loan.totalInterest) + Number(loan.totalInterest3 || 0) + Number(totalInterest2));
        } else if (refunds.length > 0) {
            const refund = refunds[0];
            totalRefund = Math.round(Number(loan.principal) + Number(loan.totalInterest) + Number(loan.totalInterest3 || 0) + Number(totalInterest2));

            if (refund.total_refund2 >= totalRefund) {
                status = "<span style='color: green;'>ชำระครบ</span>";
                totalRepayment = '-';
                daysUntilReturn = '-';
                totalInterest2 = originalTotalInterest2;
            } else {
                status = "<span style='color: green;'>ต่อดอก</span>";
                totalRepayment = '-';
                daysUntilReturn = '-';
                totalInterest2 = originalTotalInterest2;
            }
        } else {
            if (status !== "<span style='color: red;'>เเบล็คลิช</span>") {
                if (currentDate > returnDate) {
                    status = "<span style='color: orange;'>เลยสัญญา</span>";
                } else if (currentDate < returnDate) {
                    status = "<span style='color: blue;'>อยู่ในสัญญา</span>";
                } else if (currentDate === returnDate) {
                    status = "<span style='color: #FF00FF;'>ครบสัญญา</span>";
                }
            }
            totalRefund = Math.round(Number(loan.principal) + Number(loan.totalInterest) + Number(totalInterest2) + Number(loan.totalInterest3 || 0));
        }

        const totalInterest4 = Math.round(Number(loan.totalInterest) + Number(totalInterest2) + Number(loan.totalInterest3 || 0));

        const updatedLoanData = {
            totalRepayment,
            daysUntilReturn,
            totalInterest2,
            totalInterest3: loan.totalInterest3 ? Math.round(Number(loan.totalInterest3)) : 0,
            status,
            totalRefund,
            principal: Math.round(loan.principal),
            totalInterest4
        };

        await LoanInformation.updateOne({ _id: loan._id }, { $set: updatedLoanData });

        return {
            ...loan._doc,
            ...updatedLoanData
        };
    } catch (error) {
        console.error('Error occurred while calculating loan data:', error.message);
        throw error;
    }
}











// ปิดสัญญาผ่าน API
app.put('/api/close-loan/:loanId', async (req, res) => {
    const loanId = req.params.loanId;

    try {
        // อัปเดตสถานะของสัญญาเป็น 'เบล็คลิช'
        await LoanInformation.findByIdAndUpdate(
            loanId,
            { status: "<span style='color: red;'>เเบล็คลิช</span>" }
        );

        // คำนวณและอัปเดตข้อมูลของสัญญา
        const loan = await LoanInformation.findById(loanId);
        const currentDate = new Date();
        const calculatedLoanData = await calculateLoanData(loan, currentDate);

        // กำหนดค่า default สำหรับ totalRepayment, daysUntilReturn, และ totalInterest2
        const updatedLoanData = {
            ...calculatedLoanData,
            totalRepayment: '-',
            daysUntilReturn: '-',
            totalInterest2: calculatedLoanData.totalInterest2 // ใช้ค่าเดิมที่คำนวณได้
        };

        // อัปเดตข้อมูลในฐานข้อมูล
        await LoanInformation.updateOne(
            { _id: loanId },
            { $set: updatedLoanData }
        );

        res.json(updatedLoanData); // ส่งข้อมูลที่อัปเดตแล้วกลับไปยัง client
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการปิดสัญญา:', error.message);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการปิดสัญญา' });
    }
});















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


// ส่งข้อมูลเงินต้นสะสมไปยังหน้าลูกหนี้
app.get('/api/loan-principal-sum/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;
        console.log('idCardNumber:', idCardNumber);  // Debug id_card_number

        const loans = await LoanInformation.aggregate([
            { 
                $match: { 
                    id_card_number: idCardNumber, 
                    bill_number: 1  // กำหนดให้เป็นตัวเลข
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalPrincipal: { $sum: { $toDouble: "$principal" } } 
                } 
            }
        ]);
        console.log('Loans:', loans);  // Debug loans

        const totalPrincipal = loans.length > 0 ? loans[0].totalPrincipal : 0;
        res.json({ totalPrincipal });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send(err.message);
    }
});





//ส่งข้อมูลลูกหนี้ทั้งหมดของเเต่ละเเอดมิน
app.get('/api/loan/count', async (req, res) => {
    const managerNickname = req.query.nickname;

    try {
        const result = await LoanInformation.aggregate([
            { $match: { manager: managerNickname } },
            { $group: { _id: "$id_card_number" } },
            { $count: "uniqueIdCardNumbers" }
        ]);

        const loanCount = result.length > 0 ? result[0].uniqueIdCardNumbers : 0;
        res.json({ loanCount });
    } catch (err) {
        res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงข้อมูล' });
    }
});






app.get('/api/loan/in-contract', async (req, res) => {
    const managerNickname = req.query.nickname;
    console.log('Manager Nickname (In Contract):', managerNickname);

    try {
        // หา manager จาก nickname
        const manager = await Manager.findOne({ nickname: managerNickname });
        if (!manager) {
            return res.status(404).json({ error: 'ไม่พบผู้จัดการที่มี nickname นี้' });
        }

        const managerId = manager._id; // ใช้ managerId ถ้าต้องการแสดง แต่ไม่ได้ใช้ในที่นี้

        const result = await LoanInformation.aggregate([
            { 
                $match: { 
                    manager: managerNickname, // ใช้ managerNickname ตรงๆ
                    status: {
                        $in: [
                            "<span style='color: blue;'>อยู่ในสัญญา</span>",
                            "<span style='color: green;'>ต่อดอก</span>"
                        ]
                    }
                }
            },
            {
                $sort: {
                    contract_number: -1,
                    bill_number: -1
                }
            },
            {
                $group: {
                    _id: "$id_card_number",
                    latestLoan: { $first: "$$ROOT" }
                }
            },
            { 
                $count: "uniqueIdCardNumbers" 
            }
        ]);

        const loanCount = result.length > 0 ? result[0].uniqueIdCardNumbers : 0;
        res.json({ loanCount });
    } catch (err) {
        console.error('Error in /api/loan/in-contract:', err);
        res.status(500).json({ error: 'มีข้อผิดพลาดในการดึงข้อมูล' });
    }
});




//ส่งข้อมูลสถานะครบสัญญาไปหน้าเเจ้งเตือน
app.get('/api/loans/completed', async (req, res) => {
    try {
        const loans = await LoanInformation.find({ status: "<span style='color: #FF00FF;'>ครบสัญญา</span>" });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        // ค้นหาข้อมูลสัญญาใหม่ทั้งหมดจากฐานข้อมูลและเรียงลำดับตาม contract_number และ bill_number
        const newContracts = await LoanInformation.find({ status: 'new' })
            .sort({ contract_number: -1, bill_number: -1 });

        // ส่งข้อมูลสัญญาใหม่ทั้งหมดกลับไปยังหน้าเว็บไซต์
        res.status(200).json(newContracts);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสัญญาใหม่:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสัญญาใหม่');
    }
});


//ส่งข้อมูลคินเงินไปหน้าคืนเงิน
app.get('/api/refunds/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;
        const refunds = await Refund.find({ id_card_number: idCardNumber })
            .populate('loan')
            .sort({ contract_number: -1, bill_number: -1 });
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
function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 ต้องบวก 1 และ pad ให้มีสองหลัก
    const dd = String(date.getDate()).padStart(2, '0'); // pad ให้มีสองหลัก
    return `${yyyy}-${mm}-${dd}`;
}

// บันทึกส่วนแบ่ง
app.post('/profit-sharing', upload.fields([
    { name: 'collector_receipt_photo', maxCount: 1 },
    { name: 'manager_receipt_photo', maxCount: 1 },
    { name: 'receiver_receipt_photo', maxCount: 1 }
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
            collector_share_percent,
            collector_share,
            initial_profit2,
            manager_name,
            manager_share2,
            manager_share,
            receiver_profit,
            receiver_name,
            receiver_share_percent,
            receiver_share,
            total_share,
            net_profit,
            refundId
        } = req.body;

        console.log('req.body:', req.body);
        console.log('req.files:', req.files);

        const collectorReceiptPhoto = req.files['collector_receipt_photo'] ? req.files['collector_receipt_photo'][0].path : null;
        const managerReceiptPhoto = req.files['manager_receipt_photo'] ? req.files['manager_receipt_photo'][0].path : null;
        const receiverReceiptPhoto = req.files['receiver_receipt_photo'] ? req.files['receiver_receipt_photo'][0].path : null;

        const ObjectId = require('mongoose').Types.ObjectId;
        const refundObjectId = new ObjectId(refundId);

        const refundDoc = await Refund.findById(refundObjectId);
        if (!refundDoc) {
            console.log("Refund not found!");
            return res.status(404).json({ message: 'Refund not found' });
        }

        // สำรองค่าของ status ก่อนที่จะเปลี่ยนแปลง
        const previousStatus = refundDoc.status;

        // แปลง return_date_input เป็นปี เดือน วัน
        const [year, month, day] = return_date_input.split('-').map(Number);
        const returnDate = new Date(year, month - 1, day); // month - 1 เพราะเดือนใน JavaScript เริ่มที่ 0

        // แสดงผลวันที่ในรูปแบบ "YYYY-MM-DD"
        console.log("Formatted returnDate:", formatDate(returnDate));

        const profitSharing = new ProfitSharing({
            manager,
            id_card_number,
            fname,
            lname,
            contract_number,
            bill_number,
            returnDate: formatDate(returnDate), // ใช้ฟังก์ชัน formatDate ในการจัดรูปแบบวันที่
            initialProfit: parseFloat(initial_profit),
            collectorName: collector_name,
            collectorSharePercent: parseFloat(collector_share_percent),
            collectorShare: parseFloat(collector_share),
            collectorReceiptPhoto,
            initialProfit2: parseFloat(initial_profit2),
            managerName: manager_name,
            managerSharePercent: parseFloat(manager_share2),
            managerShare: parseFloat(manager_share),
            managerReceiptPhoto,
            receiverProfit: parseFloat(receiver_profit),
            receiverName: receiver_name,
            receiverSharePercent: parseFloat(receiver_share_percent),
            receiverShare: parseFloat(receiver_share),
            receiverReceiptPhoto,
            totalShare: parseFloat(total_share),
            netProfit: parseFloat(net_profit),
            refund: refundObjectId,
            originalStatus: previousStatus // เก็บสถานะเดิมไว้ใน ProfitSharing
        });

        console.log('profitSharing:', profitSharing);

        await profitSharing.save();

        refundDoc.status = '<span style="color: green;">เเบ่งเเล้ว</span>';
        await refundDoc.save();

        res.redirect(`/ส่วนเเบ่ง.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}`);
    } catch (error) {
        console.error(error);
        
        // คืนค่า status กลับไปยังค่าก่อนหน้าหากมีข้อผิดพลาด
        if (refundDoc) {
            refundDoc.status = previousStatus;
            await refundDoc.save();
        }

        res.status(500).json({ message: 'Server error' });
    }
});





//ส่งข้อมูลไปหน้าส่วนเเบ่ง
app.get('/get-profit-sharing-data/:id_card_number', async (req, res) => {
    try {
        const idCardNumber = req.params.id_card_number;

        // Find profit sharing data based on id_card_number from the database and sort it
        const profitSharingData = await ProfitSharing.find({ id_card_number: idCardNumber })
            .sort({ contract_number: -1, bill_number: -1 });

        // Send the profit sharing data as JSON response
        res.json(profitSharingData);
    } catch (error) {
        // If there is an error, send a 500 status code with an error message
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



//ส่งค่าชื่อเเอดมินดูเเล
app.get('/api/manager_name', async (req, res) => {
    try {
      const manager_name = await Manager.find({}, 'nickname'); // ดึงเฉพาะฟิลด์ nickname
      res.json(manager_name);
    } catch (err) {
      res.status(500).send(err);
    }
});



//ส่งค่าชื่อเเอดมินรับเงิน
app.get('/api/receiver_name', async (req, res) => {
    try {
      const receiver_name = await Manager.find({}, 'nickname'); // ดึงเฉพาะฟิลด์ nickname
      res.json(receiver_name);
    } catch (err) {
      res.status(500).send(err);
    }
});





// ลบข้อมูลส่วนแบ่ง
app.delete('/api/delete-profit-sharing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { id_card_number } = req.query;

        // ค้นหาเอกสาร ProfitSharing ที่ต้องการลบ
        const profitSharingDoc = await ProfitSharing.findById(id);
        
        if (!profitSharingDoc) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // ค้นหาเอกสาร Refund ที่เกี่ยวข้อง
        const refundDoc = await Refund.findById(profitSharingDoc.refund);
        
        if (!refundDoc) {
            return res.status(404).json({ message: 'Refund not found' });
        }

        // ลบข้อมูลส่วนแบ่งจากฐานข้อมูล
        const deletedProfitSharing = await ProfitSharing.findByIdAndDelete(id);

        if (!deletedProfitSharing) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // คืนค่า status กลับไปยังค่าก่อนหน้า
        refundDoc.status = profitSharingDoc.originalStatus;
        await refundDoc.save();

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
      line: req.body.line,
      authentication: req.body.authentication
      
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
        const managers = await Manager.find().sort({ lname: 1 }); // จัดเรียงตาม lname
        console.log("🚀 ~ app.get ~ managers:", managers);
        console.log('Managers:', managers); // ตรวจสอบข้อมูลที่ดึงมา
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแอดมิน' });
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









// บันทึกยึดทรัพย์
app.post('/api/seize-assets', upload.single('assetPhoto'), async (req, res) => {
    try {
        const { id_card_number, contract_number, bill_number, seizureDate, principal, seizureCost, totalproperty, assetName, assetDetails } = req.body;
        const assetPhoto = req.file ? req.file.path : '';

        // ค้นหา LoanInformation ที่ตรงกับ id_card_number, contract_number, และ bill_number
        const loan = await LoanInformation.findOne({ id_card_number, contract_number, bill_number });

        if (!loan) {
            return res.status(400).send('Error: Loan not found.');
        }

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
            assetPhoto,
            status: "<span style='color: red;'>ยังไม่ขาย</span>", // กำหนดค่าของ status ให้ถูกต้อง
            loan: loan._id // อ้างอิงถึง ObjectId ของ LoanInformation
        });

        await newSeizure.save();

        // อัปเดตสถานะใน LoanInformation เป็น "ยึดทรัพย์"
        loan.status = "<span style='color: red;'>ยึดทรัพย์</span>";
        await loan.save();

        res.redirect('/คลังทรัพย์สิน.html');
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});



// ส่งข้อมูลไปหน้าคลังทรัพย์สิน
app.get('/api/seize-assets', async (req, res) => {
    try {
        const seizures = await Seizure.find()
            .sort({ contract_number: -1, bill_number: -1 }); // เพิ่มการจัดเรียงตาม contract_number และ bill_number
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
        seizure.status = "<span style='color: green;'>ขายเเล้ว</span>"; // ตั้งค่าสถานะการขายในการยึดทรัพย์
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
        const sales = await Sale.find()
            .populate('seizure_id')
            .sort({ contract_number: -1, bill_number: -1 }); // เพิ่มการจัดเรียงตาม contract_number และ bill_number

        // ส่งข้อมูลการขายในรูปแบบ JSON
        res.json(sales);
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการขาย:', err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลการขาย');
    }
});



// ลบข้อมูลขายทรัพย์
app.delete('/sales/:saleId', async (req, res) => {
    try {
        const { saleId } = req.params;
        const deletedSale = await Sale.findByIdAndDelete(saleId);

        if (!deletedSale) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        }

        console.log('Deleted Sale:', deletedSale);

        // ค้นหา Seizure ที่เกี่ยวข้องกับ sale ที่ถูกลบ
        const seizure = await Seizure.findById(deletedSale.seizure_id);

        if (seizure) {
            console.log('Found Seizure:', seizure);
            // อัปเดตสถานะกลับไปเป็นค่าดั้งเดิม (เช่น "ยังไม่ขาย")
            seizure.status = "<span style='color: red;'>ยังไม่ขาย</span>";
            await seizure.save();
            console.log('Updated Seizure:', seizure);
        } else {
            console.log('ไม่พบ Seizure ที่เกี่ยวข้อง');
        }

        res.status(200).json({ message: 'ลบข้อมูลสำเร็จ' });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
});






// บันทึกไอคราว
app.post('/save_record', async (req, res) => {
    try {
        const {
            record_date,
            device_id,
            phone_number,
            user_email,
            email_password,
            icloud_password
        } = req.body;

        console.log("Received data:", req.body);

        // ค้นหา LoanInformation ที่มี email_icloud เหมือนกับ user_email ที่ส่งมา
        const loanInformations = await LoanInformation.find({ email_icloud: user_email });

        // นับจำนวน iCloudRecord ที่มีการอ้างอิงจาก LoanInformation ที่พบ
        let countIcloudRecords = 0;
        for (const loanInfo of loanInformations) {
            countIcloudRecords += loanInfo.icloud_records.length;
        }

        console.log(`Found ${countIcloudRecords} iCloudRecords with matching email_icloud: ${user_email}`);

        // สร้าง iCloudRecord ใหม่
        const newRecord = new iCloudRecord({
            record_date,
            device_id,
            phone_number,
            user_email,
            email_password,
            icloud_password,
            number_of_users: countIcloudRecords, // กำหนดจำนวน iCloudRecord จาก LoanInformation
            status: "active" // ตั้งค่าสถานะ
        });

        // บันทึก iCloudRecord
        const savedRecord = await newRecord.save();
        console.log("iCloud record saved successfully");

        res.status(201).redirect('/ไอคราว.html');
    } catch (err) {
        console.error("Error saving iCloud record:", err);
        res.status(500).send('Failed to save iCloud Record');
    }
});








// ส่งข้อมูลไอคราวไปหน้าไอคราว
app.get('/get_records', async (req, res) => {
    try {
        // ดึงข้อมูลไอคราวทั้งหมดจาก MongoDB และเรียงจากใหม่สุดไปเก่า
        const records = await iCloudRecord.find().sort({ record_date: -1 });

        // ส่งข้อมูลกลับเป็น JSON
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch iCloud Records');
    }
});



// ลบข้อมูลไอคราว
app.delete('/delete_record/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ค้นหาและลบข้อมูลใน MongoDB โดยใช้ ID
        const deletedRecord = await iCloudRecord.findByIdAndDelete(id);

        if (deletedRecord) {
            res.status(200).send('iCloud Record deleted successfully');
        } else {
            res.status(404).send('iCloud Record not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete iCloud Record');
    }
});


// ดึงข้อมูล phone_number ของ iCloud records โดยไม่ให้ซ้ำกัน ไปหน้าบันทึกสัญญา
app.get('/api/phone_number', async (req, res) => {
    try {
        const phoneNumbers = await iCloudRecord.aggregate([
            {
                $group: {
                    _id: '$phone_number',
                }
            },
            {
                $project: {
                    _id: 0,
                    phone_number: '$_id'
                }
            }
        ]);
        res.json(phoneNumbers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch phone numbers from iCloud Records');
    }
});



// ดึงข้อมูล user_email ของ iCloud records ไปหน้าบันทึกสัญญา
app.get('/api/user_email', async (req, res) => {
    try {
        const userEmails = await iCloudRecord.find({}, 'phone_number user_email');
        res.json(userEmails);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch user emails from iCloud Records');
    }
});


//ดึงข้อมูลรหัสไอคราวล่าสุด ไปหน้าบันทึกสัญญา
app.get('/api/icloud_password/:phoneNumber/:userEmail', async (req, res) => {
    try {
        const { phoneNumber, userEmail } = req.params;

        // ค้นหา iCloudRecord ที่มี phoneNumber และ userEmail ที่ระบุ
        const record = await iCloudRecord.findOne({ phone_number: phoneNumber, user_email: userEmail });

        if (record) {
            // ถ้าพบเอกสาร ส่งข้อมูล icloud_password กลับไปยัง client
            res.send(record.icloud_password);
        } else {
            // ถ้าไม่พบเอกสาร ส่งข้อความแจ้งเตือน appropriate message
            res.status(404).send('iCloud Record not found for the given phone number and email');
        }
    } catch (error) {
        console.error('Error fetching icloud password:', error);
        res.status(500).send('Failed to fetch iCloud password');
    }
});


//อัปเดตรหัสไอคราว ในหน้าบันทึกสัญญา
app.post('/updateIcloudPassword', async (req, res) => {
    const { phoneicloud, email_icloud, code_icloud } = req.body;

    console.log('รับข้อมูลจาก Frontend:', req.body);

    try {
        const updatedRecord = await iCloudRecord.findOneAndUpdate(
            { phone_number: phoneicloud, user_email: email_icloud },
            { icloud_password: code_icloud },
            { new: true, upsert: false } // ไม่สร้างเอกสารใหม่ถ้าไม่มี
        );

        if (updatedRecord) {
            console.log('อัปเดตสำเร็จ:', updatedRecord);
            res.status(200).json(updatedRecord);
        } else {
            console.error('ไม่พบเอกสารที่ต้องการอัปเดต');
            res.status(404).json({ error: 'ไม่พบเอกสารที่ต้องการอัปเดต' });
        }
    } catch (error) {
        console.error('Error updating iCloud password:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดต' });
    }
});








//กำไรขาดทุนส่วนบุคคล
app.get('/api/loaninfo/:id_card_number', async (req, res) => {
    const id_card_number = req.params.id_card_number;
    try {
        console.log(`Received request for id_card_number: ${id_card_number}`);
        
        const loanDocuments = await LoanInformation.find({ id_card_number }).sort({ contract_number: -1 }).exec();
        console.log('Loan documents found:', loanDocuments);
        
        const uniqueContractNumbers = [...new Set(loanDocuments.map(doc => doc.contract_number))];
        console.log('Unique contract numbers:', uniqueContractNumbers);
      
        const results = [];
        for (const contract_number of uniqueContractNumbers) {
            console.log(`Processing contract_number: ${contract_number}`);
            
            const totalRefund = await Refund.aggregate([
                { $match: { id_card_number: id_card_number, contract_number: contract_number } },
                {
                    $group: {
                        _id: null,
                        total_refund2: { $sum: { $toDouble: '$total_refund2' } }
                    }
                }
            ]);
            console.log(`Total refund for contract_number ${contract_number}: ${totalRefund.length > 0 ? totalRefund[0].total_refund2 : 0}`);
            
            const refundDocuments = await Refund.find({ id_card_number, contract_number });
            console.log(`Refund documents for contract_number ${contract_number}:`, refundDocuments);
          
            const initialLoan = await LoanInformation.findOne({ id_card_number, contract_number, bill_number: 1 });
            
            // แปลงค่า Recommended ให้เป็นตัวเลข
            const recommended = initialLoan && !isNaN(parseFloat(initialLoan.Recommended))
                ? parseFloat(initialLoan.Recommended)
                : 0;
            console.log(`Recommended for contract_number ${contract_number}:`, recommended);
        
            const profitSharings = await ProfitSharing.find({ id_card_number, contract_number });
            console.log(`Profit sharing documents for contract_number ${contract_number}:`, profitSharings);
            
            const totalShare = profitSharings.reduce((total, doc) => total + parseFloat(doc.totalShare), 0);
            console.log(`Total share for contract_number ${contract_number}: ${totalShare}`);
        
            const finalStatus = await LoanInformation.findOne({ id_card_number, contract_number }).sort({ bill_number: -1 }).exec();
            console.log(`Final status for contract_number ${contract_number}:`, finalStatus);

            let statusMessage = '';
            if (finalStatus && finalStatus.status === "<span style='color: green;'>ชำระครบ</span>") {
                statusMessage = "<span style='color: green;'>จ่ายครบแล้ว</span>";
            } else {
                statusMessage = "<span style='color: red;'>จ่ายยังไม่ครบ</span>";
            }
        
            results.push({
                contract_number,
                total_refund2: totalRefund.length > 0 ? totalRefund[0].total_refund2 : 0,
                refundDocuments,
                principal: initialLoan ? parseFloat(initialLoan.principal) : 0,
                recommended,
                totalShare,
                status: statusMessage,
                netProfit: 0
            });
        }
      
        console.log('Final results:', results);
        res.json(results);
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).send(err.message);
    }
});






//เพิ่มรายได้
app.post('/save-income', upload.single('income_receipt'), async (req, res) => {
    try {
        // ดึงข้อมูลจากแบบฟอร์ม
        const { record_date, income_amount, details } = req.body;
        const incomeReceiptPath = req.file ? req.file.path : '';

        // สร้าง instance ใหม่ของ Income
        const newIncome = new Income({
            record_date: record_date, // แปลงวันที่เป็น Date object
            income_amount: parseFloat(income_amount), // แปลงยอดรายได้เป็น Number
            details: details, // รายละเอียด
            income_receipt_path: incomeReceiptPath // บันทึกพาธของไฟล์สลิปรายได้
        });

        // บันทึกข้อมูลลงฐานข้อมูล
        await newIncome.save();

        // ส่งข้อมูลกลับเป็น JSON response
        res.redirect('/รายงานผล.html');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ', err);
        res.status(500).json({ error: 'พบข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});


//เพิ่มค่าใช้จ่าย
app.post('/save-expense', upload.single('expense_receipt'), async (req, res) => {
    try {
        // ดึงข้อมูลจากแบบฟอร์ม
        const { expense_date, expense_amount, details } = req.body;
        const expenseReceiptPath = req.file ? req.file.path : '';

        // สร้าง instance ใหม่ของ Expense (หรือตามชื่อ model ที่ใช้)
        const newExpense = new Expense({
            expense_date: expense_date, // แปลงวันที่เป็น Date object
            expense_amount: parseFloat(expense_amount), // แปลงยอดค่าใช้จ่ายเป็น Number
            details: details, // รายละเอียด
            expense_receipt_path: expenseReceiptPath // บันทึกพาธของไฟล์สลิปรายได้
        });

        // บันทึกข้อมูลลงฐานข้อมูล
        await newExpense.save();

        // ส่งข้อมูลกลับเป็น JSON response
        res.redirect('/รายงานผล.html');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลค่าใช้จ่าย: ', err);
        res.status(500).json({ error: 'พบข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});



//เพิ่มเงินทุน
app.post('/save-capital', upload.single('capital_receipt'), async (req, res) => {
    try {
        // ดึงข้อมูลจากแบบฟอร์ม
        const { capital_date, capital_amount, details } = req.body;
        const capitalReceiptPath = req.file ? req.file.path : '';

        // สร้าง instance ใหม่ของ Capital
        const newCapital = new Capital({
            capital_date: capital_date, // แปลงวันที่เป็น Date object
            capital_amount: parseFloat(capital_amount), // แปลงยอดเงินทุนเป็น Number
            details: details, // รายละเอียด
            capital_receipt_path: capitalReceiptPath // บันทึกพาธของไฟล์สลิปเงินทุน
        });

        // บันทึกข้อมูลลงฐานข้อมูล
        await newCapital.save();

        // ส่งข้อมูลกลับเป็น JSON response
        res.redirect('/รายงานผล.html');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลเงินทุน: ', err);
        res.status(500).json({ error: 'พบข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});



//ปล่อยยอดเงินต้นหน้ารายงานผล
app.get('/getLoanInformation1', async (req, res) => {
    try {
        let loanData = await LoanInformation.find({ bill_number: 1 }, 'loanDate principal');
        loanData = loanData.filter(loan => loan.principal !== 0);
        res.json(loanData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching loan information' });
    }
});

//ค่าเเนะนำหน้ารายงานผล
app.get('/getLoanInformation2', async (req, res) => {
    try {
        let loanData = await LoanInformation.find({ bill_number: 1 }, 'loanDate Recommended');
        loanData = loanData.filter(loan => loan.Recommended !== 0);
        res.json(loanData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching loan information' });
    }
});

//คืนเงินต้นหน้ารายงานผล
app.get('/getRefundInformation1', async (req, res) => {
    try {
        let refundData = await Refund.find({}, 'refund_principal return_date');
        refundData = refundData.filter(refund => refund.refund_principal !== 0);
        res.json(refundData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching refund information' });
    }
});

//คืนดอกเบี้ยหน้ารายงานผล
app.get('/getRefundInformation2', async (req, res) => {
    try {
        let refunds = await Refund.find({}, 'refund_interest return_date');
        refunds = refunds.filter(refund => refund.refund_interest !== 0);
        res.json(refunds);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching refund information' });
    }
});

//ค่าทวงหน้ารายงานผล
app.get('/getRefunds', async (req, res) => {
    try {
        let refundData = await Refund.find({}, 'debtAmount return_date');
        refundData = refundData.filter(refund => refund.debtAmount !== 0);
        res.json(refundData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching refund data' });
    }
});

//ส่วนเเบ่งหน้ารายงานผล
app.get('/getProfitSharings', async (req, res) => {
    try {
        let profitSharings = await ProfitSharing.find({}, 'totalShare returnDate');
        profitSharings = profitSharings.filter(sharing => sharing.totalShare !== 0);
        res.json(profitSharings);
    } catch (err) {
        console.error('Error fetching profit sharings:', err);
        res.status(500).json({ error: 'Error fetching profit sharings' });
    }
});

//ค่ายึดทรัพย์หน้ารายงานผล
app.get('/getSeizures', async (req, res) => {
    try {
        let seizures = await Seizure.find({}, 'seizureCost seizureDate');
        seizures = seizures.filter(seizure => seizure.seizureCost !== 0);
        res.json(seizures);
    } catch (err) {
        console.error('Error fetching seizures:', err);
        res.status(500).json({ error: 'Error fetching seizures' });
    }
});

//ขายทรัพย์หน้ารายงานผล
app.get('/getSales', async (req, res) => {
    try {
        let sales = await Sale.find({}, 'sellamount sell_date');
        sales = sales.filter(sale => sale.sellamount !== 0);
        res.json(sales);
    } catch (err) {
        console.error('Error fetching sales:', err);
        res.status(500).json({ error: 'Error fetching sales' });
    }
});

//เพิ่มค่าใช้จ่ายหน้ารายงานผล
app.get('/getExpenses', async (req, res) => {
    try {
        let expenses = await Expense.find({}, 'expense_date expense_amount details');
        expenses = expenses.filter(expense => expense.expense_amount !== 0);
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
});

//เพิ่มรายได้หน้ารายงานผล
app.get('/getIncomes', async (req, res) => {
    try {
        let incomes = await Income.find({}, 'record_date income_amount details');
        incomes = incomes.filter(income => income.income_amount !== 0);
        res.json(incomes);
    } catch (err) {
        console.error('Error fetching incomes:', err);
        res.status(500).json({ error: 'Error fetching incomes' });
    }
});

//เพิ่มเงินทุนหน้ารายงานผล
app.get('/getCapitals', async (req, res) => {
    try {
        let capitals = await Capital.find({}, 'capital_date capital_amount details');
        capitals = capitals.filter(capital => capital.capital_amount !== 0);
        res.json(capitals);
    } catch (err) {
        console.error('Error fetching capitals:', err);
        res.status(500).json({ error: 'Error fetching capitals' });
    }
});





// กำหนดพอร์ตที่เซิร์ฟเวอร์จะใช้
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
