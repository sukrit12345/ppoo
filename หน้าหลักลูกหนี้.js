// ฟังก์ชันสำหรับรับพารามิเตอร์จาก URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// รับค่าจาก URL พารามิเตอร์ id และ id_card_number
const id = getQueryParam('id');
const idCardNumber = getQueryParam('id_card_number');

// ตรวจสอบค่าพารามิเตอร์ใน console
console.log('ID:', id);
console.log('ID Card Number:', idCardNumber);

// แสดง idCardNumber ใน span ที่มี id "id_card_number"
if (idCardNumber) {
    document.getElementById('id_card_number').innerText = idCardNumber;
} else {
    document.getElementById('id_card_number').innerText = 'ไม่มีข้อมูล';
}

// ตรวจสอบว่ามีพารามิเตอร์ id หรือ id_card_number หรือไม่
if (id || idCardNumber) { // เปลี่ยนเป็น OR เพื่อค้นหาทั้งสองแบบ
    // เรียก API เพื่อค้นหาข้อมูลลูกหนี้หรือเจ้าหนี้
    fetch(`/api/search?id=${id || ''}&id_card_number=${idCardNumber || ''}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // ตรวจสอบข้อมูลที่ได้รับจาก API
            console.log('Data from API:', data);

            if (data.role === 'user' && data.data) {
                // แสดงเลขบัตรประชาชนของลูกหนี้
                // document.getElementById('id_card_number').innerText = data.data.id_card_number || 'ไม่มีข้อมูล'; // ใช้ค่าใน idCardNumber แทน
            } else if (data.role === 'creditor' && data.data) {
                // แสดงชื่อร้านของเจ้าหนี้
                document.getElementById('store_name').innerText = data.data.username || 'ไม่มีข้อมูล';
            } else {
                alert('ไม่พบข้อมูลลูกหนี้หรือเจ้าหนี้');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่พบข้อมูลลูกหนี้');
        });
} else {
    alert('กรุณาระบุ id และเลขบัตรประชาชนใน URL');
}










// ฟังก์ชันสำหรับไปยังหน้ารายการกู้
function goToLoanList() {
    // รับค่าจากพารามิเตอร์ใน URL
    const id = getQueryParam('id');
    const idCardNumber = getQueryParam('id_card_number');
    
    // ตรวจสอบว่ามีค่าในพารามิเตอร์หรือไม่
    if (id && idCardNumber) {
        // เปลี่ยนเส้นทางไปยังรายการกู้.html พร้อมส่ง id และ id_card_number
        window.location.href = `รายการกู้.html?id=${id}&id_card_number=${idCardNumber}`;
    } else {
        alert('ข้อมูลไม่เพียงพอ กรุณาเข้าสู่ระบบใหม่');
    }
}

// ฟังก์ชันสำหรับไปยังหน้าโปรไฟล์ลูกหนี้
function goToProfile() {
    // รับค่าจากพารามิเตอร์ใน URL
    const id = getQueryParam('id');
    const idCardNumber = getQueryParam('id_card_number');
    
    // ตรวจสอบว่ามีค่าในพารามิเตอร์หรือไม่
    if (id && idCardNumber) {
        // เปลี่ยนเส้นทางไปยังโปรไฟล์ลูกหนี้.html พร้อมส่ง id และ id_card_number
        window.location.href = `โปรไฟล์ลูกหนี้.html?id=${id}&id_card_number=${idCardNumber}`;
    } else {
        alert('ข้อมูลไม่เพียงพอ กรุณาเข้าสู่ระบบใหม่');
    }
}

// ฟังก์ชันสำหรับไปยังหน้าช่องทางคืนเงิน
function goToPaymentMethods() {
    // รับค่าจากพารามิเตอร์ใน URL
    const id = getQueryParam('id');
    const idCardNumber = getQueryParam('id_card_number');
    
    // ตรวจสอบว่ามีค่าในพารามิเตอร์หรือไม่
    if (id && idCardNumber) {
        // เปลี่ยนเส้นทางไปยังช่องทางคืนเงิน.html พร้อมส่ง id และ id_card_number
        window.location.href = `ช่องทางคืนเงิน.html?id=${id}&id_card_number=${idCardNumber}`;
    } else {
        alert('ข้อมูลไม่เพียงพอ กรุณาเข้าสู่ระบบใหม่');
    }
}