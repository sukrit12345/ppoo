document.addEventListener("DOMContentLoaded", function () {
    // เมื่อ DOM โหลดเสร็จสมบูรณ์
    var urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าตามชื่อพารามิเตอร์ที่ต้องการ
    var idCardNumber = urlParams.get('id_card_number');
    var contractNumber = urlParams.get('contract_number');
    var billNumber = urlParams.get('bill_number');
    var principal = urlParams.get('principal');

    // ตรวจสอบค่าที่ดึงได้
    console.log("ID Card Number:", idCardNumber);
    console.log("Contract Number:", contractNumber);
    console.log("Bill Number:", billNumber);
    console.log("Principal:", principal);

    // กำหนดค่าที่ดึงได้ในฟอร์ม
    if (idCardNumber) document.getElementById("id_card_number").value = idCardNumber;
    if (contractNumber) document.getElementById("contract_number").value = contractNumber;
    if (billNumber) document.getElementById("bill_number").value = billNumber;
    if (principal) document.getElementById("principal").value = principal;

    // กำหนดค่าวันที่ให้กับ input element "seizureDate"
    setReturnDateInput();
});

// เรียกฟังก์ชัน setReturnDateInput เมื่อหน้าเว็บโหลด
function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "seizureDate"
    document.getElementById('seizureDate').value = today.getFullYear() + '-' + month + '-' + day;
}

// คำนวณค่ารวมต้นทุนทรัพย์เมื่อมีการเปลี่ยนแปลงใน principal หรือ seizureCost
document.getElementById('principal').addEventListener('input', calculateTotalProperty);
document.getElementById('seizureCost').addEventListener('input', calculateTotalProperty);

function calculateTotalProperty() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const seizureCost = parseFloat(document.getElementById('seizureCost').value) || 0;
    const totalProperty = Math.round(principal + seizureCost); // ให้เปลี่ยนจาก toFixed(0) เป็น Math.round() เพื่อให้ได้ผลลัพธ์เป็นจำนวนเต็ม
    document.getElementById('totalproperty').value = totalProperty; // ปรับการกำหนดค่าที่นี่
}