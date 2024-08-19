document.addEventListener("DOMContentLoaded", function () {
    // เมื่อ DOM โหลดเสร็จสมบูรณ์
    var urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าตามชื่อพารามิเตอร์ที่ต้องการ
    var idCardNumber = urlParams.get('id_card_number');
    var contractNumber = urlParams.get('contract_number');
    var billNumber = urlParams.get('bill_number');
    var principal = urlParams.get('principal');
    var loanId = urlParams.get('loan_id'); // ดึงค่า loan_id

    // ตรวจสอบค่าที่ดึงได้
    console.log("ID Card Number:", idCardNumber);
    console.log("Contract Number:", contractNumber);
    console.log("Bill Number:", billNumber);
    console.log("Principal:", principal);
    console.log("Loan ID:", loanId); // ตรวจสอบค่า loan_id

    // กำหนดค่าที่ดึงได้ในฟอร์ม
    if (idCardNumber) document.getElementById("id_card_number").value = idCardNumber;
    if (contractNumber) document.getElementById("contract_number").value = contractNumber;
    if (billNumber) document.getElementById("bill_number").value = billNumber;
    if (principal) document.getElementById("principal").value = principal;
    
    // กำหนดค่า loan_id ให้กับ input element "loan"
    document.getElementById('loan').value = loanId || '';

    // กำหนดค่าวันที่ให้กับ input element "seizureDate"
    setReturnDateInput();
});

// เรียกฟังก์ชัน setReturnDateInput เมื่อหน้าเว็บโหลด
function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "seizureDate"
    document.getElementById('seizureDate').value = today.getFullYear() + '-' + month + '-' + day;
}

// คำนวณค่ารวมต้นทุนทรัพย์เมื่อมีการเปลี่ยนแปลงใน principal หรือ seizureCost
document.getElementById('principal').addEventListener('input', calculateTotalProperty);
document.getElementById('seizureCost').addEventListener('input', calculateTotalProperty);

function calculateTotalProperty() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const seizureCost = parseFloat(document.getElementById('seizureCost').value) || 0;
    const totalProperty = Math.round(principal + seizureCost); // ให้เปลี่ยนจาก toFixed(0) เป็น Math.round() เพื่อให้ได้ผลลัพธ์เป็นจำนวนเต็ม
    document.getElementById('totalproperty').value = totalProperty; // ปรับการกำหนดค่าที่นี่
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

// เพิ่ม event listeners ให้กับ input file
document.getElementById('assetPhoto').addEventListener('change', handleFileSelect);
document.getElementById('seizureCost2').addEventListener('change', handleFileSelect);



document.getElementById('seizureForm').addEventListener('submit', function(event) {
    // อัปเดตข้อมูล Base64 ของไฟล์
    const assetPhoto = document.getElementById('assetPhoto').files[0];
    const seizureCost2 = document.getElementById('seizureCost2').files[0];

    if (assetPhoto) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('assetPhotoBase64').value = e.target.result;
        };
        reader.readAsDataURL(assetPhoto);
    }

    if (seizureCost2) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('seizureCost2Base64').value = e.target.result;
        };
        reader.readAsDataURL(seizureCost2);
    }
});




//เเสดงข้อมูลตามid
document.addEventListener("DOMContentLoaded", async function() {
    // ดึงค่าพารามิเตอร์จาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const seizureId = urlParams.get('seizure_id');

    if (seizureId) {
        try {
            // ดึงข้อมูลจาก API ตาม seizureId
            const response = await fetch(`/api/seize-assetss/${seizureId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const seizure = await response.json();

            // ตรวจสอบค่าที่ดึงมาและแสดงในฟอร์ม
            document.getElementById('id_card_number').value = seizure.id_card_number || '';
            document.getElementById('contract_number').value = seizure.contract_number || '';
            document.getElementById('bill_number').value = seizure.bill_number || '';
            document.getElementById('seizureDate').value = seizure.seizureDate || '';
            document.getElementById('collector_name').value = seizure.collector_name || '';
            document.getElementById('principal').value = seizure.principal || '';
            document.getElementById('seizureCost').value = seizure.seizureCost || '';
            document.getElementById('totalproperty').value = seizure.totalproperty || '';
            document.getElementById('assetName').value = seizure.assetName || '';
            document.getElementById('assetDetails').value = seizure.assetDetails || '';

            // แสดงภาพตัวอย่างสำหรับรูปทรัพย์ที่ยึด
            if (seizure.assetPhoto && seizure.assetPhoto.length > 0) {
                const photoPreview = document.getElementById('assetPhoto_preview');
                const base64Image = seizure.assetPhoto[0].data; // ข้อมูล Base64 ของภาพ
                photoPreview.src = base64Image;
                photoPreview.style.display = 'block';
            } else {
                document.getElementById('assetPhoto_preview').style.display = 'none';
            }

            // แสดงภาพตัวอย่างสำหรับรูปสลิปค่ายึดทรัพย์
            if (seizure.seizureCost2 && seizure.seizureCost2.length > 0) {
                const costPreview = document.getElementById('seizureCost2_preview');
                const base64Image = seizure.seizureCost2[0].data; // ข้อมูล Base64 ของภาพ
                costPreview.src = base64Image;
                costPreview.style.display = 'block';
            } else {
                document.getElementById('seizureCost2_preview').style.display = 'none';
            }

            // ทำให้ฟิลด์ทั้งหมดเป็น readonly
            document.querySelectorAll('input, select, textarea').forEach(element => {
                element.setAttribute('readonly', 'readonly');
            });

            // ปิดการทำงานของปุ่มบันทึก
            document.getElementById('save_button').setAttribute('disabled', 'disabled');

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
        }
    } else {
        console.error('Seizure ID is missing');
    }
});


