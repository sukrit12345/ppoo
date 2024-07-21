function setexpense_date() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "record_date"
    var dateString = today.getFullYear() + '-' + month + '-' + day;
    document.getElementById('expense_date').value = dateString;
}

// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ
setexpense_date();