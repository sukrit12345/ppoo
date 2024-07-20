function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1).toString().padStart(2, '0');
    var day = today.getDate().toString().padStart(2, '0');

    // กำหนดค่าวันที่ให้กับ input element "record_date"
    document.getElementById('record_date').value = today.getFullYear() + '-' + month + '-' + day;
}

document.addEventListener('DOMContentLoaded', setReturnDateInput);





document.addEventListener("DOMContentLoaded", function() {
    var input = document.getElementById("phone_number");
    var errorMessage = document.getElementById("error_message");
    var form = document.getElementById("icloudForm");
    var submitButton = form.querySelector('input[type="submit"]');

    input.addEventListener("input", function(event) {
        var value = input.value;

        // ตรวจสอบและแก้ไขค่าที่ป้อนในช่อง input
        if (/[^0-9]/.test(value) || value.length > 10) {
            // ถ้ามี ให้ตัดอักขระที่ไม่ใช่ตัวเลขออก
            input.value = value.replace(/[^0-9]/g, "").slice(0, 10);
        }

        // แสดงข้อความ "เบอร์โทรศัพท์ไม่ถูกต้อง" หากความยาวไม่ครบ 10 ตัวอักษร
        if (input.value.length === 10) {
            errorMessage.textContent = "";
            submitButton.disabled = false; // เปิดใช้งานปุ่ม submit
        } else {
            errorMessage.textContent = "เบอร์โทรศัพท์ไม่ถูกต้อง";
            submitButton.disabled = true; // ปิดการใช้งานปุ่ม submit
        }
    });

    // ปิดการใช้งานปุ่ม submit เริ่มต้นเมื่อโหลดหน้าเว็บ
    submitButton.disabled = true;

    form.addEventListener("submit", function(event) {
        if (input.value.length !== 10) {
            event.preventDefault(); // ป้องกันการส่งฟอร์มถ้าเบอร์โทรศัพท์ไม่ถูกต้อง
            errorMessage.textContent = "เบอร์โทรศัพท์ไม่ถูกต้อง";
        }
    });
});