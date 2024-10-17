

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

    const managerSelect = document.getElementById('manager');

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









//สร้างวันที่ปัจจุบัน
// เรียกฟังก์ชัน setDate เมื่อหน้าเว็บโหลด
window.onload = setDate;

function setDate() {
      // สร้างวันที่ปัจจุบัน
      var today = new Date();

      // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
      var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
      var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

      // กำหนดค่าวันที่ให้กับ input element "return_date_input"
      document.getElementById('date').value = today.getFullYear() + '-' + month + '-' + day;
}


//ตรวจเลขบัตรเเละเบอร
document.addEventListener("DOMContentLoaded", function() {
    var phoneInput = document.getElementById("phone");
    var phoneErrorMessage = document.getElementById("error_message");
    var idCardInput = document.getElementById("id_card_number");
    var idCardErrorMessage = document.getElementById("idCardError");
    var form = document.getElementById("debtorForm");
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

    // ฟังก์ชันตรวจสอบฟอร์มทั้งหมด
    function validateForm() {
        var isPhoneValid = validatePhoneInput();
        var isIdCardValid = validateIdCardInput();

        // เปิดใช้งานหรือปิดการใช้งานปุ่ม submit ตามผลการตรวจสอบ
        submitButton.disabled = !(isPhoneValid && isIdCardValid);
    }

    // Event listener สำหรับการป้อนข้อมูลในช่องเบอร์โทรศัพท์
    phoneInput.addEventListener("input", validateForm);

    // Event listener สำหรับการป้อนข้อมูลในช่องเลขบัตรประชาชน
    idCardInput.addEventListener("input", validateForm);

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















//เเสดงข้อมูลที่ถูกบันทึกเเล้ว
document.addEventListener('DOMContentLoaded', function() {
    const creditorId = localStorage.getItem('id_shop');

    if (!creditorId) {
        console.error('No creditorId found in localStorage');
        return;
    }

    // ตรวจสอบว่า creditorId ถูกนำไปใช้ใน URL อย่างถูกต้อง
    console.log('Using creditorId in fetch:', creditorId);

    fetch(`/api/managers?creditorId=${encodeURIComponent(creditorId)}`)
        .then(response => response.json())
        .then(data => {
            const managerSelect = document.getElementById('manager');

            data.forEach(manager => {
                const option = document.createElement('option');
                option.value = manager.nickname;
                option.textContent = manager.nickname;
                managerSelect.appendChild(option);
            });

            const urlParams = new URLSearchParams(window.location.search);
            const debtorId = urlParams.get('id');

            if (debtorId) {
                // ตรวจสอบว่า creditorId ถูกนำไปใช้ใน URL อย่างถูกต้อง
                console.log('Fetching debtor data with creditorId:', creditorId);
                fetch(`/api/debtor/${debtorId}?creditorId=${encodeURIComponent(creditorId)}`)
                    .then(response => response.json())
                    .then(debtor => {
                        document.getElementById('date').value = debtor.date;
                        document.getElementById('id_card_number').value = debtor.id_card_number;
                        document.getElementById('fname').value = debtor.fname;
                        document.getElementById('lname').value = debtor.lname;
                        document.getElementById('occupation').value = debtor.occupation;
                        document.getElementById('monthly_income_amount').value = debtor.monthly_income_amount;
                        document.getElementById('seizable_assets_description').value = debtor.seizable_assets_description;
                        document.getElementById('ig').value = debtor.ig;
                        document.getElementById('facebook').value = debtor.facebook;
                        document.getElementById('line').value = debtor.line;
                        document.getElementById('phone').value = debtor.phone;
                        document.getElementById('province').value = debtor.province;
                        document.getElementById('currentAddress').value = debtor.currentAddress;
                        document.getElementById('workOrStudyAddress').value = debtor.workOrStudyAddress;
                        document.getElementById('workOrStudyAddress2').value = debtor.workOrStudyAddress2;
                        document.getElementById('grade').value = debtor.grade;
                        document.getElementById('course').value = debtor.course;

                        const options = managerSelect.options;
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].value === debtor.manager) {
                                options[i].selected = true;
                                break;
                            }
                        }
                    })
                    .catch(error => console.error('Error fetching debtor data:', error));
            }
        })
        .catch(error => console.error('Error fetching managers:', error));
});





//เเสดงไฟล์ภาพที่กำลังบันทึก
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

    // เพิ่ม event listeners ให้กับ input file
    document.getElementById('id_card_photo').addEventListener('change', handleFileSelect);
    document.getElementById('id_card_photo2').addEventListener('change', handleFileSelect);
    document.getElementById('student_record_photo').addEventListener('change', handleFileSelect);
    document.getElementById('timetable_photo').addEventListener('change', handleFileSelect);
    document.getElementById('current_address_map').addEventListener('change', handleFileSelect);
    document.getElementById('work_address_map').addEventListener('change', handleFileSelect);
    document.getElementById('otherImages').addEventListener('change', handleFileSelect);




    



    
//เเสดงข้อมูลไฟล์ภาพที่ถูกบันทึกเเล้ว
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const debtorId = urlParams.get('id');

    if (debtorId) {
        fetch(`/debtorinfo/${debtorId}`)
            .then(response => response.json())
            .then(data => {
                // แสดงข้อมูลลูกหนี้
                
                if (data.id_card_photo_base64) {
                    document.getElementById('id_card_photo_preview').src = data.id_card_photo_base64;
                    document.getElementById('id_card_photo_preview').style.display = 'block';
                }
                if (data.id_card_photo2_base64) {
                    document.getElementById('id_card_photo2_preview').src = data.id_card_photo2_base64;
                    document.getElementById('id_card_photo2_preview').style.display = 'block';
                }
                if (data.student_record_photo_base64) {
                    document.getElementById('student_record_photo_preview').src = data.student_record_photo_base64;
                    document.getElementById('student_record_photo_preview').style.display = 'block';
                }
                if (data.timetable_photo_base64) {
                    document.getElementById('timetable_photo_preview').src = data.timetable_photo_base64;
                    document.getElementById('timetable_photo_preview').style.display = 'block';
                }
                if (data.current_address_map_base64) {
                    document.getElementById('current_address_map_preview').src = data.current_address_map_base64;
                    document.getElementById('current_address_map_preview').style.display = 'block';
                }
                if (data.work_address_map_base64) {
                    document.getElementById('work_address_map_preview').src = data.work_address_map_base64;
                    document.getElementById('work_address_map_preview').style.display = 'block';
                }
                if (data.otherImages_base64) {
                    document.getElementById('otherImages_preview').src = data.otherImages_base64;
                    document.getElementById('otherImages_preview').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching debtor data:', error);
            });
    }
});


    

