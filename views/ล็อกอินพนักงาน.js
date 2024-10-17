document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // หยุดการส่งฟอร์มเพื่อทำการตรวจสอบ

    // ดึงข้อมูลจากฟอร์ม
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const nickname = formData.get('nickname');
    const authentication = formData.get('authentication');

    try {
        const response = await fetch('/loginnn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, nickname, authentication })
        });

        if (response.ok) {
            // เก็บข้อมูลใน localStorage
            localStorage.setItem('id_shop', id);
            localStorage.setItem('nickname', nickname);

            // ตรวจสอบข้อมูลที่เก็บใน localStorage
            console.log('Stored ID:', localStorage.getItem('id_shop'));
            console.log('Stored nickname:', localStorage.getItem('nickname'));

            // เปลี่ยนเส้นทางไปยังหน้าข้อมูลลูกหนี้
            window.location.href = '/ข้อมูลลูกหนี้.html';
        } else {
            // รับข้อความผิดพลาดจากเซิร์ฟเวอร์และแสดงป๊อปอัพ
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
});








//ตรวจไอดีต้องเป็นเลข10หลัก
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



//ตรวจรหัสยืนยันตัว
document.getElementById('authentication').addEventListener('input', function() {
    const password = this.value;
    const passwordError = document.getElementById('password-error');
    
    // ตรวจสอบถ้ากรอกเกิน 10 หลัก
    if (password.length > 6) {
        this.value = password.slice(0, 6);  // ตัดให้เหลือแค่ 6 หลัก
    }
    
    // ตรวจสอบถ้าไอดีไม่ใช่ตัวเลข 10 หลัก
    if (!/^\d{6}$/.test(password)) {
        passwordError.textContent = 'รหัสยืนยันตัวตนต้องเป็นตัวเลข 6 หลัก';
    } else {
        passwordError.textContent = '';
    }
});