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

document.addEventListener("DOMContentLoaded", async function() {
    try {
        // ดึง creditorId จาก localStorage
        const creditorId = localStorage.getItem('id_shop');
        
        if (!creditorId) {
            throw new Error('creditorId is not available in localStorage');
        }

        // เรียกข้อมูลจาก API พร้อมกับส่ง creditorId
        const response = await fetch(`/api/managersList?creditorId=${creditorId}`);
        const managers = await response.json();

        console.log('Managers Data:', managers); // ตรวจสอบข้อมูลที่ได้รับจาก API

        const managerData = document.getElementById('managerData');

        // เรียงลำดับ managers จากมากไปน้อยตาม index
        managers.sort((a, b) => (a.index < b.index) ? 1 : -1);

        for (let index = 0; index < managers.length; index++) {
            const manager = managers[index];

            const row = document.createElement('tr');

            // คำนวณสถานะของ manager โดยใช้ lateContractCount และ loanCount
            const lateRatio = manager.debtor.lateContractCount / manager.debtor.loanCount;
            let status;

            if (lateRatio >= 0.3) {
                status = "<span style='color: red;'>ปรับปรุง</span>";
            } else if (lateRatio <= 0.1) {
                status = "<span style='color: green;'>ดี</span>";
            } else { 
                status = "<span style='color: orange;'>ปานกลาง</span>";
            }

            row.innerHTML = `
                <td>${managers.length - index}</td>
                <td>${manager.record_date || ''}</td>
                <td>${manager.id_card_number || ''}</td>
                <td>${manager.fname || ''}</td>
                <td>${manager.lname || ''}</td>
                <td>${manager.phone || ''}</td>
                <td>${manager.nickname || ''}</td>
                <td>${manager.debtor.loanCount}</td>
                <td>${manager.debtor.inContractCount}</td>
                <td>${manager.debtor.lateContractCount}</td>
                <td>${status}</td>
                <td>
                    <button onclick="editManager('${manager._id}')"><i class="fas fa-pencil-alt"></i>แก้ไข</button>
                    <button onclick="confirmDeleteManager('${manager._id}')"><i class="fas fa-trash-alt"></i>ลบ</button>
                </td>
            `;

            managerData.appendChild(row);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
});



//เเก้ไข
// ฟังก์ชันสำหรับเปิด popup เมื่อกด editManager
function editManager(managerId) {
    // นำผู้ใช้ไปยังหน้า "บันทึกข้อมูลแอดมิน.html" โดยไม่ตรวจสอบข้อมูล
    window.location.href = `บันทึกข้อมูลเเอดมิน.html?_id=${managerId}`;
}






// ลบข้อมูลพนักงาน
// ฟังก์ชันยืนยันการลบข้อมูลผู้จัดการ
async function confirmDeleteManager(managerId) {
    // ยืนยันการลบด้วยการแสดงกล่องโต้ตอบ
    const confirmation = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลพนักงานคนนี้?");

    if (confirmation) {
        try {
            console.log('กำลังลบ managerId:', managerId); // Log ข้อมูลก่อนลบ

            // ส่งคำขอ DELETE ไปยัง API
            const response = await fetch(`/api/delete-manager/${managerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }

            const result = await response.json(); // รับผลลัพธ์จากเซิร์ฟเวอร์
            console.log(result.message); // แสดงข้อความที่ได้รับจากเซิร์ฟเวอร์

            // โหลดหน้าใหม่หลังจากลบเสร็จสิ้น
            window.location.reload();
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error); // แสดงข้อผิดพลาดในคอนโซล
            alert('เกิดข้อผิดพลาดในการลบข้อมูลผู้จัดการ'); // แสดงข้อความข้อผิดพลาดให้ผู้ใช้ทราบ
        }
    }
}


//ค้นหาเลขบัตรประชาชน13หลัก
function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.trim(); // ตัดช่องว่างที่อาจเกิดขึ้นได้
    
    // ตรวจสอบว่าเลขบัตรประชาชนมีความยาว 13 หลักหรือไม่
    if (filter.length !== 13 || isNaN(filter)) {
      alert("โปรดป้อนเลขบัตรประชาชนที่ถูกต้อง (13 หลัก)");
      return;
    }
  
    // ค้นหาในทุกคอลัมน์
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");
  
    for (i = 0; i < tr.length; i++) {
      var found = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่าพบข้อมูลหรือไม่
  
      for (j = 0; j < tr[i].cells.length; j++) {
        td = tr[i].getElementsByTagName("td")[j];
        if (td) {
          txtValue = td.textContent || td.innerText;
          // เปรียบเทียบข้อมูลในคอลัมน์กับค่าที่ค้นหา
          if (txtValue.trim() === filter) {
            found = true;
            break;
          }
        }
      }
  
      if (found) {
        tr[i].style.display = ""; // แสดงแถวที่พบข้อมูล
      } else {
        // ตรวจสอบว่าอิลิเมนต์ที่กำลังตรวจสอบเป็น <th> หรือไม่
        if (tr[i].getElementsByTagName("th").length === 0) {
          tr[i].style.display = "none"; // ซ่อนแถวที่ไม่พบข้อมูล
        }
      }
    }
}




//ค้นหาชื่อเเอดมิน
function customSearch1() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("newSearchInput1"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[6]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 16 (index 15)
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


//ค้นหาสถานะ
document.addEventListener("DOMContentLoaded", function() {
    // เพิ่ม EventListener ให้กับ select element
    const statusFilterSelect = document.getElementById('statusFilter');
    statusFilterSelect.addEventListener('change', searchIdCard2);

    // ฟังก์ชันค้นหาสถานะ
    function searchIdCard2() {
        // รับค่าจาก select box
        const statusFilter = statusFilterSelect.value;

        // รับตารางและแถว
        const table = document.getElementById('f');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        // ฟังก์ชันลบ HTML tags ออกจากสตริง
        function stripHTML(html) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        }

        // วนลูปผ่านแถวทั้งหมด
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const statusCell = cells[10].innerHTML; // ใช้ innerHTML แทน innerText
            const status = stripHTML(statusCell).trim(); // ลบ HTML และตัดช่องว่าง

            // ตรวจสอบว่าค่าสถานะตรงกับค่าที่เลือกหรือไม่
            if (statusFilter === "" || status === statusFilter) {
                rows[i].style.display = ""; // แสดงแถว
            } else {
                rows[i].style.display = "none"; // ซ่อนแถว
            }
        }
    }
});

