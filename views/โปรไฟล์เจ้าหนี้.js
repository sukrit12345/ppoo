//ไอดีร้าน
document.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('id_shop');
    const shopName = localStorage.getItem('shop_name');
    const nickname = localStorage.getItem('nickname');
  
    console.log('ID:', id);
    console.log('Shop Name:', shopName);
    console.log('Nickname:', nickname);
  
    // เรียกใช้ฟังก์ชันเช็คสิทธิ์
    await checkAdminAccess(nickname);
  
    // เรียกใช้ฟังก์ชัน fetchLoanData โดยส่ง id เป็นพารามิเตอร์
    fetchLoanData(id);
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





// ดึงข้อมูลเมื่อหน้าโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('id_shop'); // นำ id จาก localStorage
    if (id) {
        fetchCreditorData(id); // ดึงข้อมูลเจ้าหนี้จาก API
    }
});





// เเสดงข้อมูล
async function fetchCreditorData(id) {
    try {
        const response = await fetch(`/api/creditore/${id}`);
        const creditor = await response.json();

        if (response.ok) {
            // ฟังก์ชันสำหรับเช็คและแสดงค่าหรือข้อความว่าไม่มีข้อมูล
            const displayValue = (value) => value !== undefined ? value : "ไม่มีข้อมูล";

            // ใส่ข้อมูลเจ้าหนี้ในฟอร์ม
            document.querySelector('input[name="id"]').value = displayValue(creditor.id);
            document.querySelector('input[name="username"]').value = displayValue(creditor.username);
            document.querySelector('input[name="email"]').value = displayValue(creditor.email);
            document.querySelector('input[name="phone"]').value = displayValue(creditor.phone);
            document.querySelector('input[name="password"]').value = displayValue(creditor.password);
            document.querySelector('input[name="password3"]').value = displayValue(creditor.password3);
            document.querySelector('input[name="bank_name"]').value = displayValue(creditor.bank_name);
            document.querySelector('input[name="account_name"]').value = displayValue(creditor.account_name);
            document.querySelector('input[name="account_number"]').value = displayValue(creditor.account_number);
            document.querySelector('input[name="promptpay"]').value = displayValue(creditor.promptpay);
        } else {
            alert(creditor.message);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
}













// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
async function updateUserData() {
    const inputs = document.querySelectorAll('.info-item input');
    let updateData = {};
    const userId = document.querySelector('input[name="id"]').value; // ใช้ id แทน id_card_number

    // ตรวจสอบข้อมูลที่จะแก้ไข
    inputs.forEach(input => {
        if (!input.disabled) {
            // ตรวจสอบว่า input เป็นฟิลด์ไหนและอัปเดตข้อมูลตามนั้น
            if (input.name === "username") {
                updateData.username = input.value;
            } else if (input.name === "email") {
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
            } else if (input.name === "password3") {
                updateData.password3 = input.value;
            } else if (input.name === "bank_name") {
                updateData.bank_name = input.value;
            } else if (input.name === "account_name") {
                updateData.account_name = input.value;
            } else if (input.name === "account_number") {
                updateData.account_number = input.value;
            } else if (input.name === "promptpay") {
                updateData.promptpay = input.value;
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
        const response = await fetch(`/api/creditor/${userId}`, { // ใช้ userId ในพาท
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('ข้อมูลอัปเดตสำเร็จ');
            loadUserData(userId); // โหลดข้อมูลใหม่หลังจากอัปเดต
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
 window.location.href = 'ล็อกอินเจ้าหนี้.html'; // เปลี่ยนเส้นทางไปยังหน้า ล็อกอินลูกหนี้.html
}