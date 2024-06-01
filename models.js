const mongoose = require('mongoose');

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
    grade: String,
    course: String,
    id_card_photo: String,
    current_address_map: String,
    work_address_map: String,
    loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoanInformation' }]
});

const loanSchema = new mongoose.Schema({
    manager: { type: String, required: true },
    id_card_number: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    contract_number: { type: String, required: true },
    bill_number: { type: String, required: true },
    loanDate: { type: String, required: true },
    loanPeriod: { type: String, required: true },
    returnDate: { type: String, required: true },
    principal: { type: String, required: true }, // ควรใช้ Number แทน String
    interestRate: { type: String, required: true }, // ควรใช้ Number แทน String
    totalInterest: { type: String, required: true }, // ควรใช้ Number แทน String
    totalInterest2: { type: String, required: false }, // เพิ่มฟิลด์ใหม่
    totalInterest3: { type: String, required: false }, // เพิ่มฟิลด์ใหม่
    totalInterest4: { type: String, required: false }, // เพิ่มฟิลด์ใหม่
    totalRefund: { type: String, required: true }, // ควรใช้ Number แทน String
    status: { type: String, required: false }, // เพิ่มฟิลด์ใหม่
    storeAssets: { type: String, required: false },
    icloudAssets: { type: String, required: false },
    assetReceiptPhoto: { type: String, required: false },
    icloudAssetPhoto: { type: String, required: false },
    refundReceiptPhoto: { type: String, required: false },
    contract: { type: String, required: false },
    debtor: { type: mongoose.Schema.Types.ObjectId, ref: 'DebtorInformation', required: true }
});

const refundSchema = new mongoose.Schema({
    manager: { type: String, required: true },
    id_card_number: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    contract_number: { type: String, required: true },
    bill_number: { type: String, required: true },
    principal: { type: String, required: false },
    totalInterest4: { type: String, required: false },
    totalReturned: { type: String, required: false },
    return_date: { type: String, required: true },
    refund_principal: { type: String, required: true },
    refund_interest: { type: String, required: true },
    total_refund: { type: String, required: true },
    totalInterest5: { type: String, required: false },
    initial_profit:{ type: String, required: false },
    refund_receipt_photo: { type: String, required: false },
    loan: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanInformation', required: true } // อ้างอิงถึง loanSchema
});


const DebtorInformation = mongoose.model('DebtorInformation', debtorSchema);
const LoanInformation = mongoose.model('LoanInformation', loanSchema);
const Refund = mongoose.model('Refund', refundSchema);

module.exports = { DebtorInformation, LoanInformation, Refund };
