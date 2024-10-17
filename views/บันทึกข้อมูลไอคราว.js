// ไอดีร้าน
document.addEventListener('DOMContentLoaded', async () => { // เพิ่ม async เพื่อเรียกใช้ฟังก์ชันแบบ asynchronous
    // ดึงค่า ID จาก localStorage
    const id = localStorage.getItem('id_shop');
    const shopName = localStorage.getItem('shop_name');
    const nickname = localStorage.getItem('nickname');

    // ใส่ค่า ID ลงในฟิลด์ input ที่มี id เป็น 'creditorId'
    if (id) {
        document.getElementById('creditorId').value = id;
    }

    const managerSelect = document.getElementById('admin');

    if (nickname) {
        // สร้าง option ใหม่ที่มี value และข้อความตรงกับ nickname
        const option = document.createElement('option');
        option.value = nickname;
        option.textContent = nickname;
        option.selected = true; // ตั้งค่าให้ option นี้ถูกเลือกโดยอัตโนมัติ
        managerSelect.appendChild(option);

        // ปิดการเลือกถ้ามีค่า nickname
        managerSelect.disabled = true; // ไม่สามารถเปลี่ยนตัวเลือกอื่นได้

        // ตั้งค่าให้ hidden input เก็บค่า nickname
        document.getElementById('managerValue').value = nickname;
    }

    // แสดงค่า ID ในคอนโซลสำหรับการดีบัก
    console.log('ID:', id);
    console.log('Shop Name:', shopName);
    console.log('Creditor Value:', document.getElementById('creditorId').value); // ตรวจสอบค่าที่ตั้งใน input
    console.log('Manager Value:', nickname);

    // เรียกใช้ฟังก์ชันเช็คสิทธิ์
    await checkAdminAccess(nickname); // เรียกใช้ฟังก์ชันเช็คสิทธิ์โดยใช้ nickname
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




//ตรวจเบอร์โทรศัพท์
document.addEventListener("DOMContentLoaded", function() {
    var phoneInput = document.getElementById("phone_number"); // phoneInput สำหรับช่องเบอร์โทรศัพท์
    var phoneErrorMessage = document.getElementById("error_message"); // error message

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

        // เพิ่มเงื่อนไขให้เบอร์โทรต้องเริ่มต้นด้วยเลข 0 และมี 10 หลัก
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

    // ตรวจสอบเบอร์โทรศัพท์เมื่อมีการเปลี่ยนแปลงข้อมูลใน input
    phoneInput.addEventListener("input", validatePhoneInput);

    // ตรวจสอบเบอร์โทรศัพท์เมื่อโหลดหน้าเว็บ
    validatePhoneInput();
});




//ตรวจรหัสยืนยันตัว
function limitInput(input) {
    // ลบอักขระที่ไม่ใช่ตัวเลข
    input.value = input.value.replace(/[^0-9]/g, '');

    // ตรวจสอบความยาวของข้อมูลที่กรอก
    if (input.value.length > 6) {
        input.value = input.value.slice(0, 6); // ตัดความยาวหากเกิน 6
    }
}












// แสดงข้อมูล iCloud ตามไอดี
document.addEventListener('DOMContentLoaded', async function() {
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    const recordId = getQueryParam('_id');
    if (recordId) {
        try {
            // ดึงข้อมูล iCloudRecord ตาม _id
            const response = await fetch(`/api/icloudRecordd/${recordId}`);
            const record = await response.json();

            if (response.ok) {
                // กรอกข้อมูลลงในฟอร์ม
                document.getElementById('record_id').value = record._id || '';
                document.getElementById('device_id').value = record.device_id || '';
                document.getElementById('phone_number').value = record.phone_number || '';
                document.getElementById('user_email').value = record.user_email || '';
                document.getElementById('email_password').value = record.email_password || '';
                document.getElementById('icloud_password').value = record.icloud_password || '';

                // เพิ่มตัวเลือกลงใน select สำหรับ admin
                const adminSelect = document.getElementById('admin');
                
                // เคลียร์ตัวเลือกเดิม
                adminSelect.innerHTML = '<option value="admin">เลือกชื่อเอดมิน</option>';

                // เพิ่มตัวเลือก admin จาก record
                if (record.admin) {
                    const option = document.createElement('option');
                    option.value = record.admin; // ใช้ค่า admin ที่ได้จาก record
                    option.text = record.admin;  // ใช้ค่า admin ที่ได้จาก record
                    option.selected = true;       // ตั้งค่าให้ถูกเลือก
                    adminSelect.appendChild(option);
                }
            } else {
                console.error('Failed to fetch record:', record.message);
            }
        } catch (error) {
            console.error('Failed to fetch record:', error);
        }
    }

    // เลือกชื่อแอดมินเพื่อเพิ่มเงินทุน
    const creditorId = localStorage.getItem('id_shop'); // ดึง creditorId จาก localStorage

    if (creditorId) {
        fetch(`/api/receiver_name?creditorId=${creditorId}`) // ส่ง creditorId ไปยัง API
            .then(response => response.json())
            .then(data => {
                const adminSelect = document.getElementById('admin');

                // เติมข้อมูลตัวเลือกใหม่
                data.forEach(receiver_name => {
                    // ตรวจสอบว่าชื่อ admin ซ้ำหรือไม่
                    const existingOption = Array.from(adminSelect.options).some(option => option.value === receiver_name.nickname);
                    if (!existingOption) {
                        const option = document.createElement('option');
                        option.value = receiver_name.nickname;
                        option.textContent = receiver_name.nickname;
                        adminSelect.appendChild(option);
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.error('creditorId is not defined');
    }
});





