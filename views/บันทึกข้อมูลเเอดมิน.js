// ไอดีร้าน
document.addEventListener('DOMContentLoaded', async () => { // เพิ่ม async เพื่อใช้ await
    // ดึงค่า ID จาก localStorage
    const id = localStorage.getItem('id_shop');
    const shopName = localStorage.getItem('shop_name');
    const nickname = localStorage.getItem('nickname'); // เพิ่มการดึง nickname จาก localStorage

    // ใส่ค่า ID ลงในฟิลด์ input ที่มี id เป็น 'creditorId'
    if (id) {
        document.getElementById('creditorId').value = id;
    }

    // แสดงค่า ID และข้อมูลอื่นๆ ในคอนโซลสำหรับการดีบัก
    console.log('ID:', id);
    console.log('Shop Name:', shopName);
    console.log('Creditor Value:', document.getElementById('creditorId').value); // ตรวจสอบค่าที่ตั้งใน input
    console.log('Nickname:', nickname);

    // เรียกใช้ฟังก์ชันเช็คสิทธิ์ โดยส่งค่า nickname
    if (nickname) {
        await checkAdminAccess(nickname);
    }
});




// จัดการหน้าที่ใช้งานได้ตามตำแหน่ง
const checkAdminAccess = async (nickname) => {
    try {
        const creditorId = localStorage.getItem('id_shop'); // รับค่า creditorId จาก localStorage
        const response = await fetch(`/check_manager/${nickname}?creditorId=${creditorId}`); // ส่งค่า creditorId เป็น query parameter
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
  
        console.log('Manager data:', data); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูล
  
        if (data.job_position === 'admin') {
            // ปิดลิงก์ที่ไม่อนุญาตสำหรับ admin
            const reportLink = document.querySelector('a[href="รายงานผล.html"]');
            const icloudLink = document.querySelector('a[href="ไอคราว.html"]');
            const adminLink = document.querySelector('a[href="เเอดมิน.html"]');
            const settingsLink = document.querySelector('a[href="ตั้งค่า.html"]'); // เพิ่มการค้นหาลิงก์ตั้งค่า
  
            if (reportLink) reportLink.style.display = 'none'; // ซ่อนลิงก์รายงานผล
            if (icloudLink) icloudLink.style.display = 'none'; // ซ่อนลิงก์ไอคราว
            if (adminLink) adminLink.style.display = 'none'; // ซ่อนลิงก์เเอดมิน
            if (settingsLink) settingsLink.style.display = 'none'; // ซ่อนลิงก์ตั้งค่า
        } else if (data.job_position === 'assistant_manager') {
            // ปิดลิงก์ที่ไม่อนุญาตสำหรับ manager
            const reportLink = document.querySelector('a[href="รายงานผล.html"]');
            const settingsLink = document.querySelector('a[href="ตั้งค่า.html"]'); // ค้นหาลิงก์ตั้งค่า
  
            if (reportLink) reportLink.style.display = 'none'; // ซ่อนลิงก์รายงานผล
            if (settingsLink) settingsLink.style.display = 'none'; // ซ่อนลิงก์ตั้งค่า
        }
    } catch (error) {
        console.error('Error checking manager access:', error);
    }
};





// ฟังก์ชันสำหรับตั้งค่าวันที่ปัจจุบันและเรียกข้อมูลตำแหน่งงาน
window.onload = async () => {
    setDate(); // ตั้งค่าวันที่ปัจจุบัน

    const creditorId = localStorage.getItem('id_shop'); // รับค่า creditorId จาก localStorage
    if (creditorId) { // ตรวจสอบว่ามีค่า creditorId หรือไม่
        await fetchJobPositions(creditorId); // เรียกข้อมูลตำแหน่งงาน
    } else {
        console.error('ไม่พบ creditorId ใน localStorage');
    }
};



// ฟังก์ชันสำหรับตั้งค่าวันที่ปัจจุบัน
function setDate() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();
    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
    // กำหนดค่าวันที่ให้กับ input element "record_date"
    document.getElementById('record_date').value = today.getFullYear() + '-' + month + '-' + day;
}


//ตรวจ บัตร เบอร รหัสยืนยัน
document.addEventListener("DOMContentLoaded", function() {
    var phoneInput = document.getElementById("phone");
    var phoneErrorMessage = document.getElementById("error_message");
    var idCardInput = document.getElementById("id_card_number");
    var idCardErrorMessage = document.getElementById("idCardError");
    var authenticationInput = document.getElementById("authentication");
    var authenticationErrorMessage = document.getElementById("authenticationerror");
    var form = document.getElementById("adminForm");
    var submitButton = form.querySelector('input[type="submit"]');


// ฟังก์ชันตรวจสอบข้อมูลเบอร์โทรศัพท์
function validatePhoneInput() {
    var value = phoneInput.value;

    // ตรวจสอบและแก้ไขค่าที่ป้อนในช่อง input
    if (/[^0-9]/.test(value) || value.length > 10) {
        phoneInput.value = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    // ตรวจสอบกรณีที่ฟิลด์ว่าง (ไม่ได้กรอกใหม่)
    if (value.length === 0) {
        phoneErrorMessage.textContent = ""; // ไม่มีข้อผิดพลาดถ้าไม่กรอกใหม่
        return true; // ถือว่าผ่านการตรวจสอบ
    }

    // เพิ่มเงื่อนไขให้เบอร์โทรต้องเริ่มต้นด้วยเลข 0
    if (phoneInput.value.length === 10 && phoneInput.value.startsWith('0')) {
        phoneErrorMessage.textContent = "";
        return true;
    } else if (phoneInput.value.length > 0) {
        phoneErrorMessage.textContent = "เบอร์โทรศัพท์ต้องมี 10 หลักและเริ่มต้นด้วยเลข 0";
        return false;
    } else {
        phoneErrorMessage.textContent = ""; // ถ้าข้อมูลยังไม่ถูกกรอกให้ลบข้อความข้อผิดพลาด
        return false;
    }
}


    

    // ฟังก์ชันตรวจสอบข้อมูลเลขบัตรประชาชน
    function validateIdCardInput() {
        var value = idCardInput.value;
    
        // ตรวจสอบและแก้ไขค่าที่ป้อนในช่อง input
        if (/[^0-9]/.test(value) || value.length > 13) {
            idCardInput.value = value.replace(/[^0-9]/g, "").slice(0, 13);
        }
    
        // ตรวจสอบกรณีที่ฟิลด์ว่าง (ไม่ได้กรอกใหม่)
        if (value.length === 0) {
            idCardErrorMessage.textContent = ""; // ไม่มีข้อผิดพลาดถ้าไม่กรอกใหม่
            return true; // ถือว่าผ่านการตรวจสอบ
        }
    
        // แสดงข้อความ "เลขบัตรประชาชนไม่ถูกต้อง" หากข้อมูลไม่ถูกต้อง
        if (idCardInput.value.length === 13) {
            idCardErrorMessage.textContent = "";
            return true;
        } else if (idCardInput.value.length > 0) { // แสดงข้อความข้อผิดพลาดเฉพาะเมื่อมีการกรอกข้อมูล
            idCardErrorMessage.textContent = "เลขบัตรประชาชนไม่ถูกต้อง";
            return false;
        } else {
            idCardErrorMessage.textContent = ""; // ถ้าข้อมูลยังไม่ถูกกรอกให้ลบข้อความข้อผิดพลาด
            return false;
        }
    }
    

    // ฟังก์ชันตรวจสอบข้อมูลรหัสยืนยันตัวตน
    function validateAuthenticationInput() {
        var value = authenticationInput.value;
    
        // ตรวจสอบและแก้ไขค่าที่ป้อนในช่อง input
        if (/[^0-9]/.test(value) || value.length > 6) {
            authenticationInput.value = value.replace(/[^0-9]/g, "").slice(0, 6);
        }
    
        // ตรวจสอบกรณีที่ฟิลด์ว่าง (ไม่ได้กรอกใหม่)
        if (value.length === 0) {
            authenticationErrorMessage.textContent = ""; // ไม่มีข้อผิดพลาดถ้าไม่กรอกใหม่
            return true; // ถือว่าผ่านการตรวจสอบ
        }
    
        // แสดงข้อความ "รหัสยืนยันตัวตนไม่ถูกต้อง" หากข้อมูลไม่ถูกต้อง
        if (authenticationInput.value.length === 6) {
            authenticationErrorMessage.textContent = "";
            return true;
        } else if (authenticationInput.value.length > 0) { // แสดงข้อความข้อผิดพลาดเฉพาะเมื่อมีการกรอกข้อมูล
            authenticationErrorMessage.textContent = "รหัสยืนยันตัวตนไม่ถูกต้อง";
            return false;
        } else {
            authenticationErrorMessage.textContent = ""; // ถ้าข้อมูลยังไม่ถูกกรอกให้ลบข้อความข้อผิดพลาด
            return false;
        }
    }
    

    // ฟังก์ชันตรวจสอบฟอร์มทั้งหมด
    function validateForm() {
        var isPhoneValid = validatePhoneInput();
        var isIdCardValid = validateIdCardInput();
        var isAuthenticationValid = validateAuthenticationInput();

        // เปิดใช้งานหรือปิดการใช้งานปุ่ม submit ตามผลการตรวจสอบ
        submitButton.disabled = !(isPhoneValid && isIdCardValid && isAuthenticationValid);
    }

    // Event listener สำหรับการป้อนข้อมูลในช่องเบอร์โทรศัพท์
    phoneInput.addEventListener("input", validateForm);

    // Event listener สำหรับการป้อนข้อมูลในช่องเลขบัตรประชาชน
    idCardInput.addEventListener("input", validateForm);

    // Event listener สำหรับการป้อนข้อมูลในช่องรหัสยืนยันตัวตน
    authenticationInput.addEventListener("input", validateForm);

    // ตรวจสอบฟอร์มเมื่อมีการส่งฟอร์ม
    form.addEventListener("submit", function(event) {
        // ตรวจสอบให้แน่ใจว่า validateForm ได้อัปเดตสถานะของปุ่ม submit แล้ว
        validateForm();
        if (submitButton.disabled) {
            event.preventDefault(); // ป้องกันการส่งฟอร์มหากข้อมูลไม่ถูกต้อง
        }
    });

    // เรียกใช้งาน validateForm เมื่อเริ่มต้นเพื่อให้แน่ใจว่าปุ่ม submit ถูกตั้งค่าอย่างถูกต้อง
    validateForm();
});










//เเสดงข้อมูลตามไอดี
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const managerId = urlParams.get('_id');

    if (managerId) {
        // ตั้งค่าฟิลด์ hidden ด้วย ID ที่ดึงมาจาก URL
        document.getElementById('manager_id').value = managerId;

        // ดึงข้อมูลผู้จัดการและแสดงในฟอร์ม
        fetch(`/api/managersss/${managerId}`)
            .then(response => response.json())
            .then(manager => {
                document.getElementById('record_date').value = manager.record_date || '';
                document.getElementById('job_position').value = manager.job_position || '';
                document.getElementById('id_card_number').value = manager.id_card_number || '';
                document.getElementById('fname').value = manager.fname || '';
                document.getElementById('lname').value = manager.lname || '';
                document.getElementById('phone').value = manager.phone || '';
                document.getElementById('nickname').value = manager.nickname || '';
                document.getElementById('ig').value = manager.ig || '';
                document.getElementById('facebook').value = manager.facebook || '';
                document.getElementById('line').value = manager.line || '';
                document.getElementById('authentication').value = manager.authentication || '';
            })
            .catch(error => console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้จัดการ:', error));
    }
});

