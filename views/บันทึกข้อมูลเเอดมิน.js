// ฟังก์ชันสำหรับตั้งค่าวันที่ปัจจุบัน
window.onload = setDate;

function setDate() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();
    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
    // กำหนดค่าวันที่ให้กับ input element "record_date"
    document.getElementById('record_date').value = today.getFullYear() + '-' + month + '-' + day;
}

// ฟังก์ชันสำหรับตรวจสอบฟอร์ม
function validateForm(event) {
    var input = document.getElementById('id_card_number');
    var errorSpan = document.getElementById('idCardError');
    // ตรวจสอบว่าข้อมูลที่ป้อนเข้ามาเป็นตัวเลขและมีความยาว 13 หลัก
    var numericInput = /^[0-9]+$/;
    if (!input.value.match(numericInput) || input.value.length !== 13) {
        // แสดงข้อความเตือน
        errorSpan.textContent = "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง (13 หลักเป็นตัวเลขเท่านั้น)";
        // ยกเลิกการส่งแบบฟอร์ม
        event.preventDefault();
        return false;
    } else {
        // ล้างข้อความเตือนเมื่อข้อมูลถูกต้อง
        errorSpan.textContent = "";
        // ส่งแบบฟอร์ม
        return true;
    }
}