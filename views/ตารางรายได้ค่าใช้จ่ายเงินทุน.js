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

document.addEventListener('DOMContentLoaded', () => {
    // ดึง creditorId จาก localStorage
    const creditorId = localStorage.getItem('id_shop');

    // ตรวจสอบว่า creditorId มีค่าหรือไม่
    if (!creditorId) {
        console.error('No creditorId found in localStorage');
        return;
    }

    // ดึงข้อมูลและแสดงตาราง
    fetch(`/api/get-all-data?creditorId=${creditorId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('accountingTableBody');
            tableBody.innerHTML = ''; // ล้างข้อมูลเก่า

            let index = data.length;

            // ฟังก์ชันที่ใช้เพื่อเพิ่มแถวในตาราง
            function addRow(id, type, date, details, amount) {
                const row = document.createElement('tr');
                row.id = `row-${id}`;  // เพิ่ม ID ให้กับแถว
                row.innerHTML = `
                    <td>${index--}</td>
                    <td>${date}</td>
                    <td>${type}</td>
                    <td>${details}</td>
                    <td>${amount}</td>
                    <td>
                        <button onclick="showDetails('${id}', '${type}')">ดู</button>
                        <button onclick="deleteItem('${id}')">ลบ</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }

            // ฟังก์ชันเพื่อแปลงวันที่เป็นรูปแบบ YYYY-MM-DD
            function formatDate(dateString) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // ฟังก์ชันค้นหา
            function searchIdCard() {
                const statusFilter = document.getElementById('statusFilter').value;
                tableBody.innerHTML = ''; // ล้างข้อมูลเก่า
                index = data.length;

                // แสดงข้อมูลทั้งหมดที่รวมกัน
                data.forEach(item => {
                    let date, type, details, amount;

                    // ตรวจสอบประเภทตามเงื่อนไขที่กำหนด
                    if (item.income_amount) {
                        date = formatDate(item.record_date);
                        type = 'รายได้';
                        details = item.details;
                        amount = item.income_amount;
                    } else if (item.expense_amount) {
                        date = formatDate(item.expense_date);
                        type = 'ค่าใช้จ่าย';
                        details = item.details;
                        amount = item.expense_amount;
                    } else if (item.capital_amount) {
                        date = formatDate(item.capital_date);
                        type = 'เงินทุน';
                        details = item.details;
                        amount = item.capital_amount;
                    }

                    // ตรวจสอบประเภทก่อนเพิ่มแถว
                    if (statusFilter === '' || type === statusFilter) {
                        addRow(item._id, type, date, details, amount);  // ส่ง parameter ที่ถูกต้อง
                    }
                });
            }

            // ฟังก์ชันลบรายการ
            window.deleteItem = function(id) {
                if (confirm('คุณต้องการลบรายการนี้?')) {
                    fetch(`/api/delete-item/${id}`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(result => {
                            if (result.success) {
                                alert('ลบรายการสำเร็จ');
                                // ลบแถวออกจากตารางโดยไม่ต้องรีโหลดหน้าเว็บ
                                const row = document.getElementById(`row-${id}`);
                                if (row) {
                                    row.remove();
                                }
                            } else {
                                alert('ลบรายการไม่สำเร็จ');
                            }
                        })
                        .catch(error => {
                            console.error('Error deleting item:', error);
                        });
                }
            };

            // ฟังก์ชันดูข้อมูล
            window.showDetails = function(id, type) {
                let url;
                switch (type) {
                    case 'รายได้':
                        url = 'เพิ่มรายได้.html';
                        break;
                    case 'ค่าใช้จ่าย':
                        url = 'เพิ่มค่าใช้จ่าย.html';
                        break;
                    case 'เงินทุน':
                        url = 'เพิ่มเงินทุน.html';
                        break;
                    default:
                        console.error('Unknown type:', type);
                        return;
                }
                window.location.href = url + `?id=${id}`;
            };

            // เรียกใช้งาน searchIdCard() เมื่อเลือกค่าใน select
            document.getElementById('statusFilter').addEventListener('change', searchIdCard);

            // เรียกใช้งาน searchIdCard() เมื่อหน้าโหลดเสร็จ
            searchIdCard();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});


