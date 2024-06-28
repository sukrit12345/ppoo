
//เลือกชื่อเเอดมิน
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/managers')
      .then(response => response.json())
      .then(data => {
        const managerSelect = document.getElementById('manager');
        data.forEach(manager => {
          const option = document.createElement('option');
          option.value = manager.nickname;
          option.textContent = manager.nickname;
          managerSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
  });

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



//ตรวจสอบว่าใส่เลขบัตรครบมั้ย
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





// ดึงค่า debtorId จาก URL เเสดงข้อมูลลูกหนี้เมื่อกดปุ่มเเก้ไข
const urlParams = new URLSearchParams(window.location.search);
const debtorId = urlParams.get('id');

if (debtorId) {
    fetch(`/api/debtor/${debtorId}`)
        .then(response => response.json())
        .then(debtor => {
            document.getElementById('manager').value = debtor.manager;
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
            document.getElementById('grade').value = debtor.grade;
            document.getElementById('course').value = debtor.course;

            if (debtor.id_card_photo) {
                const idCardPhotoLink = document.getElementById('id_card_photo_link');
                idCardPhotoLink.href = `/${debtor.id_card_photo}`;
            }

            if (debtor.current_address_map) {
                const currentAddressMapLink = document.getElementById('current_address_map_link');
                currentAddressMapLink.href = `/${debtor.current_address_map}`;
            }

            if (debtor.work_address_map) {
                const workAddressMapLink = document.getElementById('work_address_map_link');
                workAddressMapLink.href = `/${debtor.work_address_map}`;
            }
            
        })
        .catch(error => console.error('Error fetching debtor data:', error));
}

//กดปุ่มบันทึกจะทำการอัปเดตช้อมูล
function updateDebtor(event) {
    event.preventDefault();
    const form = document.getElementById('debtorForm');
    const formData = new FormData(form);

    fetch(`/api/debtor/${debtorId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('อัปเดตข้อมูลลูกหนี้เรียบร้อยแล้ว');
        }
    })
    .catch(error => console.error('Error updating debtor data:', error));
}


  



  