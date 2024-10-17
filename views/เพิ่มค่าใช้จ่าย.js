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




// เเสดงไฟล์ภาพที่กำลังบันทึก
function handleFileSelect(event) {
    const input = event.target;
    const file = input.files[0];
    const preview = document.getElementById(input.id + '_preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // แสดงภาพ
        };
        reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
    } else {
        preview.src = '';
        preview.style.display = 'none'; // ซ่อนภาพ
    }
}

// เพิ่ม event listener ให้กับ input file
document.getElementById('expense_receipt').addEventListener('change', handleFileSelect);





//ดูข้อมูล
// ฟังก์ชันเพื่อดึงพารามิเตอร์จาก URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ดึงข้อมูลตามไอดีจาก API และแสดงในฟอร์ม
document.addEventListener('DOMContentLoaded', () => {
    const id = getQueryParam('id');
    if (id) {
        fetch(`/api/get-expense5/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received for expense:', data); // ตรวจสอบข้อมูลที่ได้รับ

                if (data) {
                    document.getElementById('expense_date').value = data.expense_date;
                    document.getElementById('expense_amount').value = data.expense_amount;
                    document.getElementById('details').value = data.details;

                    // แสดงรูปสลิปค่าใช้จ่ายถ้ามี
                    const imagePreview = document.getElementById('expense_receipt_preview');
                    if (data.expense_receipt_path && data.expense_receipt_path.length > 0) {
                        const file = data.expense_receipt_path[0];
                        imagePreview.style.display = 'block';
                        imagePreview.src = file.url;
                    } else {
                        imagePreview.style.display = 'none';
                    }

                    // เพิ่มตัวเลือกลงใน select สำหรับ admin
                    const adminSelect = document.getElementById('admin');
                    const option = document.createElement('option');
                    option.value = data.admin;
                    option.text = data.admin;
                    option.selected = true; // ตั้งค่าให้ถูกเลือก
                    adminSelect.appendChild(option);

                    // ปิดการใช้งาน select
                    const selectFields = document.querySelectorAll('select');
                    selectFields.forEach(select => {
                        select.disabled = true;
                    });

                    // ทำให้ฟิลด์ทั้งหมดเป็น readonly
                    document.querySelectorAll('input, textarea').forEach(element => {
                        element.setAttribute('readonly', 'readonly');
                    });

                    // ซ่อนและปิดการใช้งาน input[type="file"]
                    const fileInput = document.getElementById('expense_receipt');
                    if (fileInput) {
                        fileInput.style.display = 'none';
                        fileInput.disabled = true;
                    }

                    // ปิดการใช้งานปุ่มส่งข้อมูล
                    const submitButton = document.getElementById('save_button');
                    if (submitButton) {
                        submitButton.disabled = true;
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
});







//เลือกชื่อเเอดเพิ่มค่าใช้จ่าย
document.addEventListener('DOMContentLoaded', function() {
    const creditorId = localStorage.getItem('id_shop'); // ดึง creditorId จาก localStorage

    if (!creditorId) {
        console.error('creditorId is not defined');
        return;
    }

    fetch(`/api/receiver_name?creditorId=${creditorId}`) // ส่ง creditorId ไปยัง API
      .then(response => response.json())
      .then(data => {
        const receiver_nameSelect = document.getElementById('admin');
        data.forEach(receiver_name => {
          const option = document.createElement('option');
          option.value = receiver_name.nickname;
          option.textContent = receiver_name.nickname;
          receiver_nameSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
});




