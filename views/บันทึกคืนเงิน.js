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

    const managerSelect = document.getElementById('receiver_name');

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



//ตรวจสอบดอกเบี้ย
document.addEventListener('DOMContentLoaded', function() {
    const refundInterestInput = document.getElementById('refund_interest');
    const totalInterest4Input = document.getElementById('totalInterest4');
    const refundPrincipalInput = document.getElementById('refund_principal');
    const saveButton = document.getElementById('save_button');
    const errorMessage = document.getElementById('error_message');

    refundInterestInput.addEventListener('input', function() {
        const refundInterest = parseFloat(refundInterestInput.value);
        const totalInterest4 = parseFloat(totalInterest4Input.value);

        if (refundInterest > totalInterest4) {
            errorMessage.textContent = 'ดอกเบี้ยเกินสัญญา ให้นำเงินส่วนเกินกรอกลงเงินต้นคืนหรือค่าทวงเงินคืน';
            errorMessage.style.color = 'red'; // กำหนดสีข้อความเป็นแดง
            saveButton.disabled = true;
            refundPrincipalInput.value = ''; // เคลียร์ค่า refund_principal
            refundPrincipalInput.readOnly = false; // ให้สามารถแก้ไขค่าได้
        } else if (refundInterest < totalInterest4) {
            refundPrincipalInput.value = '0';
            refundPrincipalInput.readOnly = true;
            errorMessage.textContent = ''; // เคลียร์ข้อความแจ้งเตือน
            saveButton.disabled = false; // ปุ่มบันทึกสามารถใช้งานได้
        } else { // refundInterest === totalInterest4
            refundPrincipalInput.value = '';
            refundPrincipalInput.readOnly = false;
            errorMessage.textContent = ''; // เคลียร์ข้อความแจ้งเตือน
            saveButton.disabled = false; // ปุ่มบันทึกสามารถใช้งานได้
        }
    });
});




//เลือกชื่อเเอดมินรับเงิน
document.addEventListener('DOMContentLoaded', function() {
    const creditorId = localStorage.getItem('id_shop'); // ดึง creditorId จาก localStorage

    if (!creditorId) {
        console.error('creditorId is not defined');
        return;
    }

    fetch(`/api/receiver_name?creditorId=${creditorId}`) // ส่ง creditorId ไปยัง API
      .then(response => response.json())
      .then(data => {
        const receiver_nameSelect = document.getElementById('receiver_name');
        data.forEach(receiver_name => {
          const option = document.createElement('option');
          option.value = receiver_name.nickname;
          option.textContent = receiver_name.nickname;
          receiver_nameSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
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
document.getElementById('refund_receipt_photo').addEventListener('change', handleFileSelect);








//เเสดงข้อมูลตามไอดี
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const refundId = urlParams.get('_id');

    if (refundId) {
        try {
            const response = await fetch(`/api/refundss/${refundId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const refund = await response.json();

            // เติมข้อมูลในฟอร์ม
            document.getElementById('manager').value = refund.manager || '';
            document.getElementById('id_card_number').value = refund.id_card_number || '';
            document.getElementById('fname').value = refund.fname || '';
            document.getElementById('lname').value = refund.lname || '';
            document.getElementById('return_date_input').value = refund.return_date || '';
            document.getElementById('contract_number').value = refund.contract_number || '';
            document.getElementById('bill_number').value = refund.bill_number || '';
            document.getElementById('principal').value = refund.principal || '';
            document.getElementById('receiver_name').value = refund.receiver_name || '';
            document.getElementById('totalInterest4').value = refund.totalInterest4 || '';
            document.getElementById('totalRefund').value = refund.totalRefund || '';
            document.getElementById('refund_interest').value = refund.refund_interest || '';
            document.getElementById('refund_principal').value = refund.refund_principal || '';
            document.getElementById('debtAmount').value = refund.debtAmount || '';
            document.getElementById('total_refund2').value = refund.total_refund2 || '';

            // แสดงภาพถ่ายสลิปเงินคืนถ้ามี
            const receiptPreview = document.getElementById('refund_receipt_photo_preview');
            const fileInput = document.getElementById('refund_receipt_photo');
            if (refund.refund_receipt_photo && refund.refund_receipt_photo.length > 0) {
                const file = refund.refund_receipt_photo[0]; // ใช้ไฟล์แรกที่พบในอาร์เรย์
                const imageUrl = `data:${file.mimetype};base64,${file.data}`;
                receiptPreview.src = imageUrl;
                receiptPreview.style.display = 'block';
            } else {
                receiptPreview.style.display = 'none'; // ซ่อนรูปถ้าข้อมูลไม่มี
            }

            // ทำให้ฟิลด์ทั้งหมดเป็น readonly และจัดการ z-index
            document.querySelectorAll('input, select').forEach(element => {
                if (element.tagName.toLowerCase() === 'select') {
                    element.setAttribute('disabled', 'disabled');
                    element.style.position = 'relative'; // หรือ static ถ้าต้องการ
                    element.style.zIndex = '0'; // ค่าต่ำกว่าของ .navbar
                } else if (element.type !== 'file') { // ยกเว้นฟิลด์ไฟล์
                    element.setAttribute('readonly', 'readonly');
                }
            });

            // ซ่อนฟิลด์ไฟล์และจัดการ z-index
            fileInput.style.display = 'none';
            fileInput.setAttribute('disabled', 'disabled'); // เพิ่มการตั้งค่าฟิลด์ไฟล์

            // ปรับตำแหน่งของฟิลด์ที่ disabled
            document.querySelectorAll('select:disabled').forEach(select => {
                select.style.marginTop = '10px'; // ปรับระยะห่างด้านบนของฟิลด์ที่ disabled
            });

            // ปิดการทำงานของปุ่มบันทึก
            document.getElementById('save_button').setAttribute('disabled', 'disabled');

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        }
    }
});


