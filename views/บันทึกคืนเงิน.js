document.addEventListener("DOMContentLoaded", function() {
    // เมื่อ DOM โหลดเสร็จสมบูรณ์
    var urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าตามชื่อพารามิเตอร์ที่ต้องการ
    var loanId = urlParams.get('loan_id');
    var idCardNumber = urlParams.get('id_card_number');
    var fname = urlParams.get('fname');
    var lname = urlParams.get('lname');
    var manager = urlParams.get('manager');
    var contractNumber = urlParams.get('contract_number');
    var billNumber = urlParams.get('bill_number');
    var principal = urlParams.get('principal');
    var totalInterest4 = urlParams.get('totalInterest4');
    var totalRefund = urlParams.get('totalRefund');

    // ตรวจสอบค่าที่ดึงได้
    console.log("Loan ID:", loanId);
    console.log("ID Card Number:", idCardNumber);
    console.log("First Name:", fname);
    console.log("Last Name:", lname);
    console.log("Manager:", manager);
    console.log("Contract Number:", contractNumber);
    console.log("Bill Number:", billNumber);
    console.log("principal:", principal);
    console.log("totalInterest4:", totalInterest4);
    console.log("totalRefund:", totalRefund);

    // กำหนดค่าที่ดึงได้ในฟอร์ม
    document.getElementById("loan").value = loanId;
    document.getElementById("id_card_number").value = idCardNumber;
    document.getElementById("fname").value = fname;
    document.getElementById("lname").value = lname;
    document.getElementById("manager").value = manager;
    document.getElementById("contract_number").value = contractNumber;
    document.getElementById("bill_number").value = billNumber;
    document.getElementById("principal").value = principal;
    document.getElementById("totalInterest4").value = totalInterest4;
    document.getElementById("totalRefund").value = totalRefund;
});

// เรียกฟังก์ชัน setReturnDateInput เมื่อหน้าเว็บโหลด
window.onload = setReturnDateInput;

function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "return_date_input"
    document.getElementById('return_date_input').value = today.getFullYear() + '-' + month + '-' + day;
}

// คำนวณรวมเงินที่คืน
// เรียกฟังก์ชัน calculateTotalRefund เมื่อมีการเปลี่ยนแปลงในเงินต้นคืนหรือดอกเบี้ยคืน
document.getElementById('refund_principal').addEventListener('input', calculateTotalRefund);
document.getElementById('refund_interest').addEventListener('input', calculateTotalRefund);
document.getElementById('debtAmount').addEventListener('input', calculateTotalRefund);

function calculateTotalRefund() {
    var principal = parseFloat(document.getElementById('refund_principal').value);
    var interest = parseFloat(document.getElementById('refund_interest').value);
    var debtAmount = parseFloat(document.getElementById('debtAmount').value);

    // ถ้า principal, interest หรือ debtAmount เป็น NaN หรือค่าลบ ให้ตั้งค่าเป็น 0
    if (isNaN(principal) || principal < 0) {
        principal = 0;
    }
    if (isNaN(interest) || interest < 0) {
        interest = 0;
    }
    if (isNaN(debtAmount) || debtAmount < 0) {
        debtAmount = 0;
    }

    var total_refund2 = principal + interest + debtAmount;

    // กำหนดค่าเงินคืนทั้งหมดให้กับ input element ของ "total_refund_input"
    document.getElementById('total_refund2').value = total_refund2.toFixed(0);
}