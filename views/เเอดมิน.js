document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('/api/managersList');
        const managers = await response.json();

        console.log('Managers Data:', managers); // ตรวจสอบข้อมูลที่ได้รับจาก API

        const managerData = document.getElementById('managerData');

        // เรียงลำดับ managers จากมากไปน้อยตาม index
        managers.sort((a, b) => (a.index < b.index) ? 1 : -1);

        for (let index = 0; index < managers.length; index++) {
            const manager = managers[index];
            // api เดิมที่ใช้ ก่อนจะเเก้โค้ด
            // /api/loan/count?nickname=${manager.nickname}
            // `/api/loan/in-contract?nickname=${manager.nickname}`
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
                    <button onclick="editManager('${manager._id}')">แก้ไข</button>
                    <button onclick="deleteManager('${manager._id}')">ลบ</button>
                </td>
            `;

            managerData.appendChild(row);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
});










// ลบข้อมูลผู้จัดการ
async function deleteManager(managerId) {
    const confirmation = confirm(`คุณต้องการลบผู้จัดการหรือไม่?`);
    if (!confirmation) return; // ถ้ายกเลิก ออกจากฟังก์ชัน

    try {
        const response = await fetch(`/api/managers/${managerId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete manager');
        }

        console.log('ลบข้อมูลผู้จัดการสำเร็จ');
        // ลบแถวที่เกี่ยวข้องในตาราง
        const row = document.getElementById(`manager-${managerId}`);
        if (row) {
            row.remove();
        }

        // เรียกใช้ฟังก์ชัน displayLoanData เพื่อแสดงข้อมูลใหม่
        displayLoanData();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูลผู้จัดการ:', error);
    }
}

function displayLoanData() {
    // เรียกหน้าเว็บไซต์อีกครั้งเพื่อแสดงข้อมูลใหม่
    window.location.reload();
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