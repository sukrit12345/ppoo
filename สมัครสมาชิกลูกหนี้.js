document.querySelector('.signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // หยุดการส่งฟอร์มเพื่อทำการตรวจสอบ
    
    const id_card_number = document.getElementById('id_card_number').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    
    // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกัน
    if (password !== password2) {
        alert('รหัสผ่านไม่ตรงกัน');
        return;
    }

    // ตรวจสอบเลขบัตรประชาชนให้เป็นตัวเลข 13 หลัก
    if (!/^\d{13}$/.test(id_card_number)) {
        alert('เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');
        return;
    }

    // ตรวจสอบเบอร์โทรศัพท์ให้เป็นตัวเลข 10 หลัก
    if (!/^\d{10}$/.test(phone)) {
        alert('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
        return;
    }
    
    // ส่งข้อมูลฟอร์มไปยังเซิร์ฟเวอร์
    try {
        const response = await fetch('/signup2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_card_number, email, phone, password, password2 })
        });

        if (response.ok) {
            window.location.href = '/ล็อกอินลูกหนี้.html'; // เปลี่ยนไปยังหน้าเข้าสู่ระบบ
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
});



//ตรวจเลขบัตรประชาชนที่ซ้ำ
document.getElementById('id_card_number').addEventListener('input', async function() {
    const id = this.value;
    const idError = document.getElementById('id_card_number-error');

    // ตรวจสอบว่าเลขบัตรประชาชนมี 13 หลักและเป็นตัวเลข
    if (id.length === 13 && /^\d{13}$/.test(id)) {
        try {
            const response = await fetch(`/check-id/${id}`); // ตรวจสอบจาก endpoint ที่ถูกต้อง
            const data = await response.json();

            if (data.exists) {
                idError.textContent = 'เลขบัตรประชาชนนี้ถูกใช้ไปแล้ว';
            } else {
                idError.textContent = '';
            }
        } catch (error) {
            console.error('Error:', error);
            idError.textContent = 'เกิดข้อผิดพลาดในการตรวจสอบเลขบัตรประชาชน';
        }
    } else {
        idError.textContent = 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก';
    }
});



//ตรวจเลขบัตรประชาชนต้องเป็นเลข13หลัก
document.getElementById('id_card_number').addEventListener('input', function() {
    const id = this.value;
    const idError = document.getElementById('id_card_number-error');
    if (!/^\d{13}$/.test(id)) {
        idError.textContent = 'ไอดีร้านต้องเป็นตัวเลข 13 หลัก';
    } else {
        idError.textContent = '';
    }
});



//ตรวจอีเมล
document.getElementById('email').addEventListener('input', function() {
    const email = this.value;
    const emailError = document.getElementById('email-error');
    // Regular expression สำหรับตรวจสอบอีเมล
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {  // ตรวจสอบรูปแบบอีเมล
        emailError.textContent = 'กรุณากรอกอีเมลให้ถูกต้อง';
    } else {
        emailError.textContent = '';
    }
});



//ตรวจเบอร์โทรศัพท์
document.getElementById('phone').addEventListener('input', function() {
    const phone = this.value;
    const phoneError = document.getElementById('phone-error');
    if (!/^0\d{9}$/.test(phone)) {  // ตรวจสอบว่าเริ่มต้นด้วย 0 และตามด้วยตัวเลขอีก 9 ตัว
        phoneError.textContent = 'ต้องเริ่มต้นด้วย 0 และเป็นตัวเลข 10 หลัก';
    } else {
        phoneError.textContent = '';
    }
});



//ตรวจยืนยันพาสเวริด
document.getElementById('password2').addEventListener('input', function() {
    const password1 = document.getElementById('password').value;
    const password2 = this.value;
    const passwordError = document.getElementById('password-error');
    if (password1 !== password2) {
        passwordError.textContent = 'รหัสผ่านไม่ตรงกัน';
    } else {
        passwordError.textContent = '';
    }
});