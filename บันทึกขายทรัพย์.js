

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

    const managerSelect = document.getElementById('salesadmin');

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










//วันที่บันทึก
function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "sell_date"
    document.getElementById('sell_date').value = today.getFullYear() + '-' + month + '-' + day;
}


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

// เพิ่ม event listener ให้กับ input file
document.getElementById('sell_slip').addEventListener('change', handleFileSelect);








//เเสดงข้อมูลกำลังบันทึกขายทรัพย์
// ฟังก์ชันเพื่อดึงพารามิเตอร์จาก URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ฟังก์ชันคำนวณกำไรสุทธิ
function calculateNetProfit() {
    var sellamount = parseFloat(document.getElementById("sellamount").value) || 0;
    var totalproperty = parseFloat(document.getElementById("totalproperty").value) || 0;
    var netprofit = sellamount - totalproperty;
    document.getElementById("netprofit").value = netprofit;
}

// ฟังก์ชันโหลดข้อมูลยึดทรัพย์จาก API
async function loadSeizureData() {
    const seizureId = getQueryParam('seizure_id');
  
    try {
        const response = await fetch(`/api/seizuree/${seizureId}`);
        const seizureData = await response.json();


        // เติมข้อมูลลงในฟอร์ม
        document.getElementById('receiver_name').value = seizureData.receiver_name;
        document.getElementById('id_card_number').value = seizureData.id_card_number;
        document.getElementById('fname').value = seizureData.fname;
        document.getElementById('lname').value = seizureData.lname;
        document.getElementById('contract_number').value = seizureData.contract_number;
        document.getElementById('bill_number').value = seizureData.bill_number;

        // ตรวจสอบว่าปุ่ม submit_button ถูกเปิดใช้งานหรือไม่
        if (document.getElementById('submit_button').hasAttribute('disabled')) {
            document.getElementById('submit_button').removeAttribute('disabled');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการยึดทรัพย์:', error);
        alert('ไม่สามารถดึงข้อมูลได้');
    }
}

// ฟังก์ชันตั้งค่าและแสดงข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function() {
    loadSeizureData();

    var urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าพารามิเตอร์จาก URL และกำหนดลงในฟอร์ม
    var totalProperty = decodeURIComponent(urlParams.get('totalproperty'));
    var assetName = decodeURIComponent(urlParams.get('assetName'));
    var assetDetails = decodeURIComponent(urlParams.get('assetDetails'));
    var seizureId = decodeURIComponent(urlParams.get('seizure_id'));

    // กำหนดค่าที่ดึงได้ในฟอร์ม
    document.getElementById("totalproperty").value = totalProperty;
    document.getElementById("assetName").value = assetName;
    document.getElementById("assetDetails").value = assetDetails;
    document.getElementById("seizure_id").value = seizureId;

    // เพิ่ม event listener เพื่อคำนวณกำไรสุทธิ
    document.getElementById("sellamount").addEventListener("input", calculateNetProfit);
    document.getElementById("totalproperty").addEventListener("input", calculateNetProfit);

    // ตั้งค่า return date input ถ้ามีฟังก์ชันนี้
    setReturnDateInput();
});













//เลือกชื่อเเอดขายทรัพย์
document.addEventListener('DOMContentLoaded', function() {
    const creditorId = localStorage.getItem('id_shop'); // ดึง creditorId จาก localStorage

    if (!creditorId) {
        console.error('creditorId is not defined');
        return;
    }

    fetch(`/api/receiver_name?creditorId=${creditorId}`) // ส่ง creditorId ไปยัง API
      .then(response => response.json())
      .then(data => {
        const receiver_nameSelect = document.getElementById('salesadmin');
        data.forEach(receiver_name => {
          const option = document.createElement('option');
          option.value = receiver_name.nickname;
          option.textContent = receiver_name.nickname;
          receiver_nameSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
});













//ดูข้อมูลบันทึกขายทรัพย์
// ฟังก์ชันเพื่อดึงพารามิเตอร์จาก URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ฟังก์ชันคำนวณกำไรสุทธิ
function calculateNetProfit() {
    var sellamount = parseFloat(document.getElementById("sellamount").value) || 0;
    var totalproperty = parseFloat(document.getElementById("totalproperty").value) || 0;
    var netprofit = sellamount - totalproperty;
    document.getElementById("netprofit").value = netprofit;
}


// ฟังก์ชันโหลดข้อมูลการขายทรัพย์จาก API
async function loadSaleData() {
    const saleId = getQueryParam('_id');
    
    try {
        const response = await fetch(`/saless/${saleId}`);
        const saleData = await response.json();

        // เติมข้อมูลลงในฟอร์ม
        document.getElementById('receiver_name').value = saleData.receiver_name;
        document.getElementById('id_card_number').value = saleData.id_card_number;
        document.getElementById('fname').value = saleData.fname;
        document.getElementById('lname').value = saleData.lname;
        document.getElementById('contract_number').value = saleData.contract_number;
        document.getElementById('bill_number').value = saleData.bill_number;
        document.getElementById('totalproperty').value = saleData.totalproperty;
        document.getElementById('assetName').value = saleData.assetName;
        document.getElementById('assetDetails').value = saleData.assetDetails;
        document.getElementById('sell_date').value = saleData.sell_date;
        document.getElementById('salesadmin').value = saleData.salesadmin;
        document.getElementById('sellamount').value = saleData.sellamount;
        document.getElementById('netprofit').value = saleData.netprofit;

        // การแสดงไฟล์สลิป
        const sellSlips = saleData.sell_slip; // sell_slip เป็น array
        const sellSlipInput = document.getElementById('sell_slip'); // ฟิลด์ input สำหรับการอัพโหลดไฟล์
        const sellSlipPreview = document.getElementById('sell_slip_preview'); // แสดงภาพสลิป

        if (sellSlips && sellSlips.length > 0) {
            // ดึงไฟล์แรกจาก array (หากมี)
            const sellSlip = sellSlips[0];

            if (sellSlip && sellSlip.data) {
                // ข้อมูลถูกเก็บเป็น Base64 อยู่แล้วใน data
                const imageUrl = sellSlip.data; // ใช้ Base64 string ใน data
                sellSlipPreview.src = imageUrl; // ตั้ง src ให้เป็น Base64 data
                sellSlipPreview.style.display = 'block'; // แสดงรูปภาพ
            } else {
                sellSlipPreview.style.display = 'none'; // ซ่อนฟิลด์ภาพหากไม่มีข้อมูล
            }

            // ซ่อนฟิลด์ input file หากมีการแสดงภาพจากข้อมูลการขาย
            sellSlipInput.style.display = 'none';
        } else {
            // ซ่อนภาพและแสดงฟิลด์ input file หากไม่มีไฟล์
            sellSlipPreview.style.display = 'none';
            sellSlipInput.style.display = 'block'; // แสดงฟิลด์ input file ให้สามารถอัพโหลดไฟล์ได้
        }

        // ซ่อนฟิลด์ input file เมื่อแสดงข้อมูลการขาย
        sellSlipInput.style.display = 'none';
        sellSlipInput.setAttribute('disabled', 'disabled'); // ปิดการใช้งานฟิลด์

        // ทำให้ปุ่ม submit_button เป็น disabled เมื่อแสดงข้อมูลการขาย
        const submitButton = document.getElementById('submit_button');
        if (submitButton) {
            submitButton.setAttribute('disabled', 'disabled');
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการขายทรัพย์:', error);
        alert('ไม่สามารถดึงข้อมูลได้');
    }
}


// ฟังก์ชันโหลดข้อมูลยึดทรัพย์จาก API
async function loadSeizureData() {
    const seizureId = getQueryParam('seizure_id');
  
    try {
        const response = await fetch(`/api/seizuree/${seizureId}`);
        const seizureData = await response.json();

        // เติมข้อมูลลงในฟอร์ม
        document.getElementById('receiver_name').value = seizureData.receiver_name;
        document.getElementById('id_card_number').value = seizureData.id_card_number;
        document.getElementById('fname').value = seizureData.fname;
        document.getElementById('lname').value = seizureData.lname;
        document.getElementById('contract_number').value = seizureData.contract_number;
        document.getElementById('bill_number').value = seizureData.bill_number;

        // ทำให้ฟิลด์ input file แสดงเมื่อแสดงข้อมูลการยึดทรัพย์
        document.getElementById('sell_slip').style.display = 'block';
        document.getElementById('sell_slip_preview').style.display = 'none';

        // เปิดใช้งานปุ่ม submit_button เมื่อลงข้อมูลการยึดทรัพย์
        const submitButton = document.getElementById('submit_button');
        if (submitButton) {
            submitButton.removeAttribute('disabled');
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการยึดทรัพย์:', error);
        alert('ไม่สามารถดึงข้อมูลได้');
    }
}

// ฟังก์ชันเพื่อทำให้ฟอร์มทั้งหมดเป็น readonly
function setFormReadonly() {
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(element => {
        element.setAttribute('readonly', 'readonly');
        // สำหรับ <select> คุณอาจต้องการปิดการเลือกเช่นกัน
        if (element.tagName === 'SELECT') {
            element.setAttribute('disabled', 'disabled');
        }
    });

    // ทำให้ปุ่ม submit_button เป็น disabled
    const submitButton = document.getElementById('submit_button');
    if (submitButton) {
        submitButton.setAttribute('disabled', 'disabled');
    }
}

// ฟังก์ชันตั้งค่าและแสดงข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", function() {
    const saleId = getQueryParam('_id');
    const seizureId = getQueryParam('seizure_id');

    if (seizureId) {
        loadSeizureData();
    } else if (saleId) {
        loadSaleData();
        // ทำให้ฟอร์มทั้งหมดเป็น readonly เมื่อพารามิเตอร์ _id มีค่า
        setFormReadonly();
    }

    // เพิ่ม event listener เพื่อคำนวณกำไรสุทธิ
    document.getElementById("sellamount").addEventListener("input", calculateNetProfit);
    document.getElementById("totalproperty").addEventListener("input", calculateNetProfit);

    // ตั้งค่า return date input ถ้ามีฟังก์ชันนี้
    setReturnDateInput();
});
