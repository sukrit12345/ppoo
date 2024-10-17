document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // หยุดการส่งฟอร์มเพื่อทำการตรวจสอบ
    
    const id = document.getElementById('id').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;
    const password3 = document.getElementById('password3').value;
    
    // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกัน
    if (password1 !== password2) {
        alert('รหัสผ่านไม่ตรงกัน');
        return;
    }

    // ตรวจสอบไอดีร้านให้เป็นตัวเลข 10 หลัก
    if (!/^\d{10}$/.test(id)) {
        alert('ไอดีร้านต้องเป็นตัวเลข 10 หลัก');
        return;
    }

    // ตรวจสอบเบอร์โทรศัพท์ให้เป็นตัวเลข 10 หลัก
    if (!/^\d{10}$/.test(phone)) {
        alert('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
        return;
    }

    // ตรวจสอบ password3 ให้เป็นตัวเลข 6 หลัก
    if (!/^\d{6}$/.test(password3)) {
        alert('รหัสผ่านยืนยันตัวต้องเป็นตัวเลข 6 หลัก');
        return;
    }

    // ส่งข้อมูลฟอร์มไปยังเซิร์ฟเวอร์
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, username, email, phone, password1, password2, password3 })
        });

        if (response.ok) {
            window.location.href = '/ล็อกอินเจ้าหนี้.html'; // เปลี่ยนไปยังหน้าเข้าสู่ระบบ
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('ตรวจสอบข้อมูลให้ถูกต้อง');
    }
});



//ตรวจไอดีที่ซ้ำ
document.getElementById('id').addEventListener('input', async function() {
    const id = this.value;
    const idError = document.getElementById('id-error');

    if (id.length === 10 && /^\d{10}$/.test(id)) { // ตรวจสอบว่าความยาว id เป็น 10 ตัวและเป็นตัวเลข
        try {
            const response = await fetch(`/checkk-id/${id}`);
            const data = await response.json();

            if (data.exists) {
                idError.textContent = 'ไอดีร้านนี้ถูกใช้ไปแล้ว';
            } else {
                idError.textContent = '';
            }
        } catch (error) {
            console.error('Error:', error);
            idError.textContent = 'เกิดข้อผิดพลาดในการตรวจสอบไอดีร้าน';
        }
    } else {
        idError.textContent = 'ไอดีร้านต้องเป็นตัวเลข 10 หลัก';
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
    
    // ตรวจสอบถ้ากรอกเกิน 10 หลัก
    if (phone.length > 10) {
        this.value = phone.slice(0, 10);  // ตัดให้เหลือแค่ 10 หลัก
    }
    
    // ตรวจสอบว่าเริ่มต้นด้วย 0 และเป็นตัวเลข 10 หลัก
    if (!/^0\d{9}$/.test(phone)) {
        phoneError.textContent = 'ต้องเริ่มต้นด้วย 0 และเป็นตัวเลข 10 หลัก';
    } else {
        phoneError.textContent = '';
    }
});




//ตรวจยืนยันพาสเวริด
document.getElementById('password2').addEventListener('input', function() {
    const password1 = document.getElementById('password1').value;
    const password2 = this.value;
    const passwordError = document.getElementById('password-error');
    if (password1 !== password2) {
        passwordError.textContent = 'รหัสผ่านไม่ตรงกัน';
    } else {
        passwordError.textContent = '';
    }
});




//ตรวจรหัสผ่านยืนยันตัว
document.getElementById('password3').addEventListener('input', function() {
    const password = this.value;
    const passwordError = document.getElementById('password3-error');
    
    // ตรวจสอบถ้ากรอกเกิน 6 หลัก
    if (password.length > 6) {
        this.value = password.slice(0, 6);  // ตัดให้เหลือแค่ 6 หลัก
    }
    
    // ตรวจสอบว่ากรอกเป็นตัวเลข 6 หลัก
    if (!/^\d{0,6}$/.test(password)) {
        passwordError.textContent = 'รหัสผ่านต้องเป็นตัวเลข 6 หลัก';
    } else {
        passwordError.textContent = '';
    }
});
