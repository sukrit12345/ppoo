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

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // ดึง creditorId จาก localStorage
        const creditorId = localStorage.getItem('id_shop');

        if (!creditorId) {
            console.error('creditorId is not available in localStorage');
            return;
        }

        // เรียกข้อมูลจาก /get_records พร้อมกับพารามิเตอร์ creditorId
        const response = await fetch(`/get_records?creditorId=${creditorId}`);
        const records = await response.json(); // แปลงเป็น JSON

        const tableBody = document.getElementById('recordsTableBody');

        // วนลูปเพื่อสร้างแถวของตาราง
        records.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${records.length - index}</td>
                <td>${record.record_date}</td>
                <td>${record.device_id}</td>
                <td>${record.phone_number}</td>
                <td>${record.user_email}</td>
                <td>${record.email_password}</td>
                <td>${record.icloud_password}</td>
                <td>${record.loanCount}</td>
                <td><button onclick="showeRecord('${record._id}', '${record.phone_number}', '${record.user_email}')"><i class="fas fa-eye"></i>ดู</button></td>
                <td>
                    <button onclick="editrecords('${record._id}')"><i class="fas fa-pencil-alt"></i>แก้ไข</button>
                    <button onclick="deleteRecord('${record._id}')"><i class="fas fa-trash-alt"></i>ลบ</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Failed to fetch iCloud Records:', error);
    }
});



//เเก้ไข
function editrecords(recordId) {
    // เปลี่ยนเส้นทางไปยังหน้าบันทึกไอคราว.html พร้อมกับพารามิเตอร์ _id
    window.location.href = `บันทึกข้อมูลไอคราว.html?_id=${encodeURIComponent(recordId)}`;
}



//ไปหน้าจำนวนสัญญาเเต่ละไอคราว
async function showeRecord(recordId, phoneNumber, userEmail) {
    try {
        if (!recordId || !phoneNumber || !userEmail) {
            throw new Error('Invalid parameters');
        }
        // ตรวจสอบ URL ที่จะไป
        const url = `จำนวนสัญญาไอคราว.html?recordId=${encodeURIComponent(recordId)}&phone_number=${encodeURIComponent(phoneNumber)}&user_email=${encodeURIComponent(userEmail)}`;
        console.log('Navigating to:', url);
        window.location.href = url;
    } catch (error) {
        console.error('Failed to navigate to record details page:', error);
    }
}








// ฟังก์ชันลบข้อมูล
async function deleteRecord(id) {
    const confirmation = confirm(`คุณต้องการลบไอคราวนี้หรือไม่?`);
    if (confirmation) {
        try {
            const response = await fetch(`/delete_record/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // รีโหลดหน้าหลังจากลบสำเร็จ
                window.location.reload();
            } else {
                throw new Error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error.message);
            // แสดงข้อความแจ้งเตือนถ้ามีข้อผิดพลาด
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    }
}





//ค้นหาเลขเครื่องโทรศัพท์
function customSearch3() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("newSearchInput3"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 3 (index 2)
        if (td) {
            txtValue = td.textContent || td.innerText;
            // ใช้เงื่อนไขเพิ่มเติมเพื่อให้ค้นหาได้ทั้งตัวเล็กและตัวใหญ่
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


//ค้นหาเบอรโทรศัพท์
function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 3 (index 2)
        if (td) {
            txtValue = td.textContent || td.innerText;
            // ใช้เงื่อนไขเพิ่มเติมเพื่อให้ค้นหาได้ทั้งตัวเล็กและตัวใหญ่
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


//ค้นหายูสอีเมล/ไอคราว
function customSearch1() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("newSearchInput1"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[4]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 3 (index 2)
        if (td) {
            txtValue = td.textContent || td.innerText;
            // ใช้เงื่อนไขเพิ่มเติมเพื่อให้ค้นหาได้ทั้งตัวเล็กและตัวใหญ่
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}





//ค้นหาจำนวนผู้ใช้ไอคราว
function searchIdCard2() {
    // รับค่าจาก input field
    const userCount = parseInt(document.getElementById('userCountRange').value, 10);

    // ตรวจสอบว่าค่าที่ป้อนเป็นตัวเลข
    if (isNaN(userCount)) {
        alert("กรุณากรอกจำนวนผู้ใช้ที่เป็นตัวเลข");
        return;
    }

    // รับตารางและแถว
    const table = document.getElementById('f');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // วนลูปผ่านแถวทั้งหมด
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const cellUserCount = parseInt(cells[7].innerText, 10); // สมมติว่า cell7 คือคอลัมน์ที่ 8 (index 7)

        // ตรวจสอบว่าค่าตัวเลขใน cell นั้นตรงหรือมีค่าน้อยกว่าที่ป้อน
        if (cellUserCount <= userCount) {
            rows[i].style.display = ""; // แสดงแถว
        } else {
            rows[i].style.display = "none"; // ซ่อนแถว
        }
    }
}

