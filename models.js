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
    loanType:{ type: String, required: false },
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
    code_icloud2: { type: String, required: false },
    assetReceiptPhoto: { type: String, required: false },
    icloudAssetPhoto: { type: String, required: false },
    refundReceiptPhoto: { type: String, required: false },
    Recommended_photo: { type: String, required: false },
    contract: { type: String, required: false },
    debtor: { type: mongoose.Schema.Types.ObjectId, ref: 'DebtorInformation', required: true },
    icloud_records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'iCloudRecord' }]
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
    collectorSharePercent: { type: Number },
    collectorShare: { type: Number },
    collectorReceiptPhoto: { type: String },
    initialProfit2: { type: Number },
    managerName: { type: String },
    managerSharePercent: { type: Number },
    managerShare: { type: Number },
    managerReceiptPhoto: { type: String },
    receiverProfit: { type: Number },
    receiverName: { type: String },
    receiverSharePercent: { type: Number },
    receiverShare: { type: Number },
    receiverReceiptPhoto: { type: String },
    totalShare: { type: Number },
    netProfit: { type: Number, required: true },
    originalStatus: { type: String },
    refund: { type: mongoose.Schema.Types.ObjectId, ref: 'Refund', required: true }
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
    line: { type: String, required: false },
    authentication: { type: String, required: false }
});


// ยึดทรัพย์
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
    seizureCost2: { type: String, required: false },
    status: { type: String, required: false },
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanInformation', required: true } // อ้างอิงถึง loanSchema
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


//ไอคราว
const iCloudRecordSchema = new mongoose.Schema({
    record_date: { type: String, required: true },
    device_id: { type: String, required: true },
    phone_number: { type: String, required: true },
    user_email: { type: String, required: true },
    email_password: { type: String, required: true },
    icloud_password: { type: String, required: true },
    number_of_users: { type: Number, default: 0 },
    status: { type: String, required: false },
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanInformation' }
});


//เพิ่มรายได้
const incomeSchema = new mongoose.Schema({
    record_date: { type: String, required: false },
    income_amount: { type: Number, required: false },
    details: { type: String, required: false },
    income_receipt_path: { type: String, required: false }
    
});

//เพิ่มค่าใช้จ่าย
const expenseSchema = new mongoose.Schema({
    expense_date: { type: String, required: true },
    expense_amount: { type: Number, required: true },
    details: { type: String, required: true },
    expense_receipt_path: { type: String } 
});



//เพิ่มเงินทุน
const capitalSchema = new mongoose.Schema({
    capital_date: { type: String, required: true },
    capital_amount: { type: Number, required: true },
    details: { type: String, required: true },
    capital_receipt_path: { type: String }
});




// กำหนดโมเดล Mongoose สำหรับแต่ละ Schema
const DebtorInformation = mongoose.model('DebtorInformation', debtorSchema);
const LoanInformation = mongoose.model('LoanInformation', loanSchema);
const Refund = mongoose.model('Refund', refundSchema);
const ProfitSharing = mongoose.model('ProfitSharing', profitSharingSchema);
const Manager = mongoose.model('Manager', managerSchema);
const Seizure = mongoose.model('Seizure', seizureSchema);
const Sale = mongoose.model('Sale', saleSchema);
const iCloudRecord = mongoose.model('iCloudRecord', iCloudRecordSchema);
const Income = mongoose.model('Income', incomeSchema);
const Expense = mongoose.model('expense', expenseSchema);
const Capital = mongoose.model('Capital', capitalSchema);

// ส่งออกโมเดล
module.exports = { DebtorInformation, LoanInformation, Refund, ProfitSharing, Manager, Seizure, Sale, iCloudRecord, Income, Expense, Capital };
