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






// ดึงข้อมูลเมื่อโหลดหน้าเว็บ
window.onload = function () {
    const id_card_number = getQueryParam('id_card_number'); // ดึง id_card_number จาก URL

    if (id_card_number) {
        fetchUserData(id_card_number); // ดึงข้อมูลผู้ใช้
    } else {
        alert('ไม่พบ id_card_number ใน URL');
    }
};





// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก API
async function fetchUserData(id_card_number) {
    try {
        const response = await fetch(`/api/user/${id_card_number}`);
        const user = await response.json();

        if (response.ok) {
            document.querySelector('input[name="id_card_number"]').value = user.id_card_number;
            document.querySelector('input[name="email"]').value = user.email;
            document.querySelector('input[name="phone"]').value = user.phone;
            document.querySelector('input[name="password"]').value = user.password;
        } else {
            alert(user.message);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
}








// ฟังก์ชันสำหรับเปิดการแก้ไขฟิลด์
function enableEdit(icon) {
    const input = icon.previousElementSibling;

    // ถ้าฟิลด์ปิดการแก้ไข (disabled) ให้เปิดการแก้ไข
    if (input.disabled) {
        input.disabled = false; // เปิดการแก้ไข
        input.focus(); // โฟกัสไปที่ input
    } else {
        // ถ้าฟิลด์เปิดอยู่แล้ว ทำการบันทึกข้อมูล
        const updateData = {};

        // บันทึกค่าที่แก้ไขไปใน updateData
        if (input.name === "email") {
            updateData.email = input.value;
        } else if (input.name === "phone") {
            updateData.phone = input.value;
        } else if (input.name === "password") {
            updateData.password = input.value;
        }

        input.disabled = true; // ปิดการแก้ไข
        
        // เรียกฟังก์ชันอัปเดตข้อมูล
        updateUserData(updateData); // ส่งข้อมูลที่อัปเดต
    }
}




// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
async function updateUserData() {
    const inputs = document.querySelectorAll('.info-item input');
    let updateData = {};
    const id_card_number = document.querySelector('input[name="id_card_number"]').value;

    // ตรวจสอบข้อมูลที่จะแก้ไข
    inputs.forEach(input => {
        if (!input.disabled) {
            // ตรวจสอบว่า input เป็นฟิลด์ไหนและอัปเดตข้อมูลตามนั้น
            if (input.name === "email") {
                updateData.email = input.value;
            } else if (input.name === "phone") {
                const phone = input.value;
                // ตรวจสอบว่าเบอร์โทรศัพท์ต้องเป็นตัวเลขสิบหลัก
                const phoneRegex = /^\d{10}$/; // ตรวจสอบว่าต้องมีตัวเลข 10 หลัก
                if (!phoneRegex.test(phone)) {
                    alert('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
                    return;
                }
                updateData.phone = phone;
            } else if (input.name === "password") {
                updateData.password = input.value;
            }
        }
    });

    // ตรวจสอบว่ามีข้อมูลที่จะอัปเดตหรือไม่
    if (Object.keys(updateData).length === 0) {
        alert('ให้กดไอคอน1ครั้งเเล้วเเก้ไขข้อมูลตามต้องการเเล้วกดปุ่มอัปเดตข้อมูล');
        return;
    }

    console.log('ข้อมูลที่ถูกส่ง:', updateData);

    try {
        const response = await fetch(`/api/user/${id_card_number}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('ข้อมูลอัปเดตสำเร็จ');
            loadUserData(id_card_number); // โหลดข้อมูลใหม่หลังจากอัปเดต
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
    }
}
















//ออกระบบ
function enableEdit(icon) {
    const input = icon.previousElementSibling;
    input.disabled = !input.disabled;
    if (!input.disabled) {
        input.focus();
    }
}

function logout() {
 alert('ออกระบบเรียบร้อย');
 window.location.href = 'ล็อกอินลูกหนี้.html'; // เปลี่ยนเส้นทางไปยังหน้า ล็อกอินลูกหนี้.html
}