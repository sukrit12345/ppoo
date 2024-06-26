const mongoose = require('mongoose');

// สร้าง Schema สำหรับ LoanInformation ก่อน
const loanInformationSchema = new mongoose.Schema({
    loanDate: { type: String, required: true },
    loanPeriod: { type: String, required: true },
    returnDate: { type: String, required: true },
    principal: { type: String, required: true },
    interestRate: { type: String, required: true },
    totalInterest: { type: String, required: true },
    totalRefund: { type: String, required: true },
    storeAssets: { type: String },
    icloudAssets: { type: String }, // เพิ่มฟิลด์นี้
    assetReceiptPhoto: { type: String },
    icloudAssetPhoto: { type: String }, // เพิ่มฟิลด์นี้
    refundReceiptPhoto: { type: String }
});

// สร้าง Schema สำหรับ DebtorInformation และฝัง LoanInformation ไว้ในนั้น
const debtorInformationSchema = new mongoose.Schema({
    date: { type: String, required: true },
    id_card_number: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    ig: { type: String },
    facebook: { type: String },
    line: { type: String },
    phone: { type: String, required: true },
    monthlyIncome: { type: String, required: true },
    occupation: { type: String, required: true },
    grade: { type: String },
    course: { type: String },
    province: { type: String, required: true },
    currentAddress: { type: String, required: true },
    workOrStudyAddress: { type: String, required: true },
    seizableAssets: { type: String },
    storeAssets: { type: String },
    id_card_photo: { type: String, required: true },
    current_address_map: { type: String, required: true },
    work_address_map: { type: String },
    loans: [loanInformationSchema]  // ฝังข้อมูล LoanInformation ใน DebtorInformation
});

// สร้างโมเดลสำหรับ DebtorInformation และ LoanInformation
const DebtorInformation = mongoose.model('DebtorInformation', debtorInformationSchema);
const LoanInformation = mongoose.model('LoanInformation', loanInformationSchema);

module.exports = { DebtorInformation, LoanInformation };
