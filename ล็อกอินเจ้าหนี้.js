document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // หยุดการส่งฟอร์มเพื่อทำการตรวจสอบ

    // ดึงข้อมูลจากฟอร์ม
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        const response = await fetch('/loginn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, username, password }) // ไม่ส่ง nickname ถ้าไม่จำเป็น
        });

        if (response.ok) {
            // ลบค่า nickname จาก localStorage หากมีการเก็บไว้ก่อนหน้านี้
            localStorage.removeItem('nickname');

            // เก็บข้อมูลที่จำเป็นใน localStorage
            localStorage.setItem('id_shop', id);
            localStorage.setItem('shop_name', username);

            // ตรวจสอบข้อมูลที่เก็บใน localStorage
            console.log('Stored ID:', localStorage.getItem('id_shop'));
            console.log('Stored Shop Name:', localStorage.getItem('shop_name'));

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