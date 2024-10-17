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

async function fetchLoanData() {
    try {
        // ดึง creditorId จาก localStorage หรือจากที่อื่นที่คุณเก็บไว้
        const creditorId = localStorage.getItem('id_shop');
        
        if (!creditorId) {
            throw new Error('creditorId is not defined');
        }

        const response = await fetch(`/api/loans/completed?creditorId=${creditorId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data fetched:', data); // ตรวจสอบข้อมูลที่ได้รับ

        // เรียงลำดับข้อมูลตาม 'totalRefund' จากมากไปน้อย
        data.sort((a, b) => parseFloat(b.totalRefund) - parseFloat(a.totalRefund));

        populateTable(data);
        updateNotificationCount(data.length); // เพิ่มการเรียกใช้เพื่ออัพเดตจำนวน
    } catch (error) {
        console.error('Error fetching loan data:', error);
    }
}


function populateTable(data) {
    const tbody = document.getElementById('loanTableBody');
    tbody.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 10; // จำนวนคอลัมน์ทั้งหมด
        cell.textContent = 'ไม่มีครบกำหนดชำระวันนี้';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    data.forEach((item, index) => {
        const row = document.createElement('tr');

        const cells = [
            data.length - index, // แสดง index ที่เรียงจากมากไปน้อย
            item.loanDate || 'N/A',
            item.id_card_number || 'N/A',
            item.fname || 'N/A',
            item.lname || 'N/A',
            item.returnDate || 'N/A',
            item.principal || 'N/A',
            item.totalInterest4 || 'N/A',
            item.totalRefund || 'N/A',
            item.manager || 'N/A'
        ];

        cells.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

function updateNotificationCount(count) {
    const notificationLink = document.querySelector('a.active2');
    if (notificationLink) {
        notificationLink.setAttribute('data-count', count); // ใช้ data-count แทนการแก้ไข innerText
        // บันทึกค่าลงใน localStorage
        localStorage.setItem('notificationCount', count);
    }
}



// เรียกใช้งานฟังก์ชันเพื่อดึงข้อมูล
fetchLoanData();
