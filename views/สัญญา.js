document.addEventListener("DOMContentLoaded", function() {
    // ดึงข้อมูลจาก URL
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');

    // แสดงข้อมูลในหน้าเว็บ
    document.getElementById('id-card-number').textContent = idCardNumber;
    document.getElementById('first-name').textContent = firstName;
    document.getElementById('last-name').textContent = lastName;
    // อื่น ๆ ของข้อมูลสัญญา
});


















document.addEventListener("DOMContentLoaded", function() {
    fetchDataAndPopulateTable();
});

function fetchDataAndPopulateTable() {
    fetch('/api/loan-data')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('a').getElementsByTagName('tbody')[0];
            
            // Reverse the data array
            data.reverse().forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>-</td>
                    <td>-</td>
                    <td>${row.loanDate}</td>
                    <td>${row.loanPeriod}</td>
                    <td>${row.returnDate}</td>
                    <td>${row.principal}</td> 
                    <td>${row.interestRate}</td>
                    <td>${row.totalInterest}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td> 
                    <button onclick="redirectToEdit('${row._id}')">แก้ไข</button>
                    <button onclick="redirectToDelete('${row._id}')">ลบ</button>
                    </td>
                    <td><button onclick="redirectToSeizeAssets('${row._id}')">ยึดทรัพย์</button></td>
                    <td><button onclick="redirectToReturnMoney('${row._id}')">คืนเงิน</button></td>
                
                `;
                tableBody.appendChild(tr);
            });

            calculateTotalIDCard();
        })
        .catch(error => console.error('Error fetching data:', error));
}


//ไปหน้าคืนเงิน
function redirectToReturnMoney(id) {
    window.location.href = `คืนเงิน.html?id=${id}`;
}



//ไปหน้ายึดทรัพย์
function redirectToSeizeAssets(id) {
    window.location.href = `คลังทรัพย์สิน.html?id=${id}`;
}








































//เปลี่ยนสีสถานะ
// ดึงตาราง HTML โดยใช้ ID
var table = document.getElementById("a");

// เลือกเซลล์ทั้งหมดที่อยู่ในคอลัมน์ที่ 12 และตรวจสอบว่ามีข้อความ "ชำระครบ" หรือไม่
var cells = document.querySelectorAll('#a td:nth-child(12)');
  
cells.forEach(function(cell) {
  var text = cell.innerHTML.trim();
  if (text === "อยู่ในสัญญา") {
    cell.classList.add('w');
  } 
  if (text === "เลยสัญญา") {
    cell.classList.add('l');
  } 
  if (text === "ครบสัญญา") {
    cell.classList.add('d');
  }
  if (text === "ต่อดอก") {
    cell.classList.add('s');
  } 
  if (text === "ชำระครบ") {
    cell.classList.add('s');
  } 
  if (text === "เเบล็คลิช") {
    cell.classList.add('b');
  } 
});

































//สร้างปุ่มลบเเละเเก้ไข
// เลือกแถวทั้งหมดในตารางยกเว้นแถวหัว
var tableRows = document.querySelectorAll("#a tr:not(:first-child)");

// วนลูปผ่านแถวทั้งหมดในตาราง
tableRows.forEach(function(row) {
    // สร้าง <td> สำหรับปุ่มแก้ไขและลบ
    var buttonCell = document.createElement("td");

    // สร้างปุ่มแก้ไข
    var editButton = document.createElement("button");
    editButton.textContent = "แก้ไข";
    editButton.onclick = function() {
        // เรียกใช้ฟังก์ชันแก้ไขแถวและส่งข้อมูลแถวที่ต้องการแก้ไขไปยังหน้า "บันทึกข้อมูลลูกหนี้.html"
        editRow(row);
    };

    // สร้างปุ่มลบ
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "ลบ";
    deleteButton.onclick = function() {
        if (confirm("คุณต้องการลบข้อมูลในแถวนี้ใช่หรือไม่?")) {
            // เรียกใช้ฟังก์ชันลบแถว
            deleteRow(row);
            // แสดงข้อความแจ้งเตือนเมื่อลบแถวสำเร็จ
            alert("ข้อมูลถูกลบเรียบร้อยแล้ว");
        } else {
            // ไม่ต้องทำอะไร
        }
    };

    // เพิ่มปุ่มแก้ไขและลบลงใน <td> เดียวกัน
    buttonCell.appendChild(editButton);
    buttonCell.appendChild(deleteButton);

    // เพิ่ม <td> ที่มีปุ่มแก้ไขและลบลงในแถว
    row.appendChild(buttonCell);
});

// ฟังก์ชันสำหรับการแก้ไขแถว
function editRow(row) {
    // ดึงข้อมูลจากแถว
    var rowData = {
        sequence: row.cells[0].textContent,
        registrationDate: row.cells[1].textContent,
        idCard: row.cells[2].textContent,
        firstName: row.cells[3].textContent,
        lastName: row.cells[4].textContent,
        principal: row.cells[5].textContent,
        interest: row.cells[6].textContent,
        refundAmount: row.cells[7].textContent,
        status: row.cells[8].textContent,
        accumulatedPrincipal: row.cells[9].textContent,
        accumulatedInterest: row.cells[10].textContent,
        accumulatedProfit: row.cells[11].textContent,
        manager: row.cells[12].textContent,
        supervisor: row.cells[13].textContent,
        branchHead: row.cells[14].textContent
    };
    alert("เริ่มแก้ไขแถวที่ " + row.cells[0].textContent);
    // เปิดหน้า "บันทึกข้อมูลลูกหนี้.html" และส่งข้อมูลแถวที่ต้องการแก้ไขไปด้วย
    window.location.href = "บันทึกสัญญา.html?data=" + JSON.stringify(rowData);
}

// ฟังก์ชันสำหรับลบแถว
function deleteRow(row) {
    row.remove();
}








//สร้างปุ่มยึดทรัพย์
// เลือกแถวทั้งหมดในตารางยกเว้นแถวแรก (header)
var rows = document.querySelectorAll("#a tr:not(:first-child)");

// วนลูปผ่านแถวทั้งหมดในตาราง
rows.forEach(function(row) {
    // สร้าง <td> สำหรับปุ่มสัญญา
    var contractCell = document.createElement("td");

    // สร้างปุ่มสัญญา
    var contractButton = document.createElement("button");
    contractButton.textContent = "ยึดทรัพย์";
    contractButton.onclick = function() {
        // เปลี่ยน URL ตามที่ต้องการให้ปุ่มสัญญานำไปยัง
        window.location.href = "บันทึกยึดทรัพย์.html";
    };

    // เพิ่มปุ่มสัญญาลงใน <td> เดียวกัน
    contractCell.appendChild(contractButton);

    // เพิ่ม <td> ที่มีปุ่มสัญญาลงในแถว
    row.appendChild(contractCell);
});








//สร้างปุ่มคืนเงิน
// เลือกแถวทั้งหมดในตารางยกเว้นแถวแรก (header)
var rows = document.querySelectorAll("#a tr:not(:first-child)");

// วนลูปผ่านแถวทั้งหมดในตาราง
rows.forEach(function(row) {
    // สร้าง <td> สำหรับปุ่มสัญญา
    var contractCell = document.createElement("td");

    // สร้างปุ่มสัญญา
    var contractButton = document.createElement("button");
    contractButton.textContent = "คืนเงิน";
    contractButton.onclick = function() {
        // เปลี่ยน URL ตามที่ต้องการให้ปุ่มสัญญานำไปยัง
        window.location.href = "บันทึกคืนเงิน.html";
    };

    // เพิ่มปุ่มสัญญาลงใน <td> เดียวกัน
    contractCell.appendChild(contractButton);

    // เพิ่ม <td> ที่มีปุ่มสัญญาลงในแถว
    row.appendChild(contractCell);
});




