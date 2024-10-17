document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // หยุดการส่งฟอร์มเพื่อทำการตรวจสอบ

    // ดึงข้อมูลจากฟอร์ม
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const username = formData.get('username');
    const password = formData.get('password');

    // ส่งข้อมูลฟอร์มไปยังเซิร์ฟเวอร์
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, username, password })
        });

        if (response.ok) {
            // ใช้ URL ของหน้าหลักลูกหนี้.html ในการเปลี่ยนเส้นทาง
            window.location.href = `/หน้าหลักลูกหนี้.html?id=${id}&id_card_number=${username}`;
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
});



//ตรวจไอดีร้าน
document.getElementById('id').addEventListener('input', function() {
    const id = this.value;
    const idError = document.getElementById('id-error');
    
    // ตรวจสอบถ้ากรอกเกิน 10 หลัก
    if (id.length > 10) {
        this.value = id.slice(0, 10);  // ตัดให้เหลือแค่ 10 หลัก
    }
    
    // ตรวจสอบถ้าไอดีไม่ใช่ตัวเลข 10 หลัก
    if (!/^\d{10}$/.test(id)) {
        idError.textContent = 'ไอดีร้านต้องเป็นตัวเลข 10 หลัก';
    } else {
        idError.textContent = '';
    }
});



//ตรวจเลขบัตรประชาชน
document.getElementById('username').addEventListener('input', function() {
    const username = this.value;
    const usernameError = document.getElementById('username-error');
    

    if (username.length > 10) {
        this.value = username.slice(0, 13);  // 
    }
    
 
    if (!/^\d{13}$/.test(username)) {
        usernameError.textContent = 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก';
    } else {
        usernameError.textContent = '';
    }
});