const mongoose = require('mongoose');

//ข้อมูลลูกหนี้
const debtorSchema = new mongoose.Schema({
    manager: String,
    date: String,
    id_card_number: String,
    fname: String,
    lname: String,
    occupation: String,
    monthly_income_amount: String,
    seizable_assets_description: String,
    ig: String,
    facebook: String,
    line: String,
    phone: String,
    province: String,
    currentAddress: String,
    workOrStudyAddress: String,
    workOrStudyAddress2: String,
    grade: String,
    course: String,
    id_card_photo: String,
    id_card_photo2: String,
    current_address_map: String,
    work_address_map: String,
    student_record_photo: String,
    timetable_photo: String,
    loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoanInformation' }]
});

//สัญญา
const loanSchema = new mongoose.Schema({
    manager: { type: String, required: false },
    id_card_number: { type: String, required: false },
    fname: { type: String, required: false },
    lname: { type: String, required: false },
    contract_number: { type: Number, required: false },
    bill_number: { type: Number, required: false },
    loanDate: { type: String, required: false },
    loanPeriod: { type: String, required: false },
    returnDate: { type: String, required: false },
    principal: { type: String, required: false }, // ควรใช้ Number แทน String => เงินต้น
    interestRate: { type: String, required: false }, // ควรใช้ Number แทน String => อัตราดอกเบี้ยต่อวัน
    totalInterest: { type: String, required: false }, // ควรใช้ Number แทน String => ดอกเบี้ย
    totalInterest2: { type: String, required: false }, // เพิ่มฟิลด์ใหม่ => ดอกปรับ
    totalInterest3: { type: String, required: false }, // เพิ่มฟิลด์ใหม่ => ดอกยกมา
    totalInterest4: { type: String, required: false }, // เพิ่มฟิลด์ใหม่ => รวมดอก
    totalRefund: { type: String, required: false }, // ควรใช้ Number แทน String =>  รวมเงินที่ต้องคืน
    manager2: { type: String, required: false },
    Recommended: { type: String, required: false },
    status: { type: String, required: false }, // เพิ่มฟิลด์ใหม่
    totalRepayment: { type: String, required: false },
    daysUntilReturn: { type: String, required: false },
    storeAssets: { type: String, required: false },
    icloudAssets: { type: String, required: false },
    phoneicloud: { type: String, required: false },
    email_icloud: { type: String, required: false },
    code_icloud: { type: String, required: false },
    assetReceiptPhoto: { type: String, required: false },
    icloudAssetPhoto: { type: String, required: false },
    refundReceiptPhoto: { type: String, required: false },
    Recommended_photo: { type: String, required: false },
    contract: { type: String, required: false },
    debtor: { type: mongoose.Schema.Types.ObjectId, ref: 'DebtorInformation', required: true }
});

//คืนเงิน
const refundSchema = new mongoose.Schema({
    manager: { type: String, required: true },
    id_card_number: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    contract_number: { type: String, required: true },
    bill_number: { type: String, required: true },
    principal: { type: String, required: false },
    totalInterest4: { type: String, required: false },
    totalRefund: { type: String, required: false },
    return_date: { type: String, required: true },
    refund_principal: { type: String, required: true },
    refund_interest: { type: String, required: true },
    total_refund2: { type: String, required: true },
    totalInterest5: { type: String, required: false },
    initial_profit: { type: String, required: false },// ส่วนเเบ่ง
    status: { type: String, required: false },
    refund_receipt_photo: { type: String, required: false },
    debtAmount: { type: String, required: false },
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanInformation', required: true }, // อ้างอิงถึง loanSchema
    
});

//ส่วนเเบ่ง
const profitSharingSchema = new mongoose.Schema({
    manager: { type: String, required: true },
    id_card_number: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    contract_number: { type: String, required: true },
    bill_number: { type: String, required: true },
    returnDate: { type: String, required: true },
    initialProfit: { type: Number, required: true },
    collectorName: { type: String },
    collectorShare: { type: Number },
    initialProfit2: { type: String },
    managerName: { type: String },
    bankName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    manager_share2: { type: String, required: false },
    managerShare: { type: Number },
    totalShare: { type: Number },
    netProfit: { type: Number, required: true },
    collectorReceiptPhoto: { type: String },
    managerReceiptPhoto: { type: String },
    refund: { type: mongoose.Schema.Types.ObjectId, ref: 'Refund', required: true },
});


// เเอดมิน
const managerSchema = new mongoose.Schema({
    record_date: { type: String, required: false },
    id_card_number: { type: String, required: false },
    fname: { type: String, required: false },
    lname:  { type: String, required: false },
    nickname: { type: String, required: false },
    phone: { type: String, required: false },
    ig: { type: String, required: false },
    facebook: { type: String, required: false },
    line: { type: String, required: false }
});

//ยึดทรัพย์
const seizureSchema = new mongoose.Schema({
    id_card_number: { type: String, required: false },
    contract_number: { type: String, required: false },
    bill_number: { type: String, required: false },
    seizureDate: { type: String, required: false },
    principal: { type: String, required: false },
    collector_name: { type: String, required: false },
    seizureCost: { type: String, required: false },
    totalproperty: { type: String, required: false },
    assetName: { type: String, required: false },
    assetDetails: { type: String, required: false },
    assetPhoto: { type: String, required: false },
    seizureCost2: { type: String, required: false }
});

//ขายทรัพย์
const saleSchema = new mongoose.Schema({
    id_card_number: { type: String, required: true },
    contract_number: { type: String, required: true },
    bill_number: { type: String, required: true },
    totalproperty: { type: String, required: true },
    sell_date: { type: String, required: true },
    assetName: { type: String, required: true },
    assetDetails: { type: String, required: true },
    sellamount: { type: Number, required: true },
    netprofit: { type: Number, required: true },
    sell_slip: { type: String },
    seizure_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seizure', required: true } // ต้องการการอ้างอิงไปยัง Seizure
});


// กำหนดโมเดล Mongoose สำหรับแต่ละ Schema
const DebtorInformation = mongoose.model('DebtorInformation', debtorSchema);
const LoanInformation = mongoose.model('LoanInformation', loanSchema);
const Refund = mongoose.model('Refund', refundSchema);
const ProfitSharing = mongoose.model('ProfitSharing', profitSharingSchema);
const Manager = mongoose.model('Manager', managerSchema);
const Seizure = mongoose.model('Seizure', seizureSchema);
const Sale = mongoose.model('Sale', saleSchema);

// ส่งออกโมเดล
module.exports = { DebtorInformation, LoanInformation, Refund, ProfitSharing, Manager, Seizure, Sale };
