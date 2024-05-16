
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

































//คำนวณสถานะ อยู่ในสัญญา เลยสัญญา 
//คำนวณวันใกล้สัญญา เลยสัญญา
// เลือกแถวทั้งหมดในตารางยกเว้นแถวแรก (header)
var rows = document.querySelectorAll("#a tr:not(:first-child)");

// วันปัจจุบัน
var today = new Date();

// วนลูปผ่านแถวทั้งหมดในตาราง
rows.forEach(function(row) {
    // ดึงค่าจาก cell ตามลำดับ
    var returnDate = new Date(row.cells[4].innerText.trim()); // วันที่คืน
    
    // คำนวณจำนวนวันที่เหลือจนถึงวันที่คืน
    var daysUntilReturn = Math.max(0, Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24)))-1;


    // คำนวณจำนวนวันที่เกินกำหนดของการคืน
    var daysOverdue = Math.max(0, Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24)))-1;


    // แสดงข้อมูลใน cell ที่ 10
    if (daysUntilReturn <= 0) {
       row.cells[10].innerText = "";
    } else {
       row.cells[10].innerText = "อีก " + daysUntilReturn + " วัน";
    }


    // แสดงข้อมูลใน cell ที่ 12
    if (daysOverdue > 0) {
       row.cells[12].innerText = "เลย " + daysOverdue + " วัน";
    } else {
       row.cells[12].innerText = "";
    }


    // แสดงข้อมูลใน cell ที่ 11
    if (returnDate > today) {
        row.cells[11].innerText = "อยู่ในสัญญา";
        row.cells[11].classList.add('w');
    } else if (returnDate < today) {
        row.cells[11].innerText = "เลยสัญญา";
        row.cells[11].classList.add('l');
    } else {
       row.cells[11].innerText = ""; // ใส่สถานะเป็นค่าว่างหากไม่ตรงกับทั้งสองเงื่อนไขด้านบน
    }
    

    // คำนวณแสดงสถานะครบสัญญา
    if (returnDate.toDateString() === today.toDateString()) {
      row.cells[11].innerText = "ครบสัญญา";
      row.cells[11].classList.add('d');
   }


});







// สร้างตัวแปรสำหรับเก็บตาราง
var table = document.getElementById('a');

// ข้อมูลที่ต้องการใส่ลงในเซลล์
var cell0 = 1;
var cell1 = 1;

// เลือกแถวสุดท้ายในตาราง
var lastRow = table.rows[table.rows.length - 1];

// ตรวจสอบว่าเซลล์ที่ต้องการมีค่าว่างหรือไม่
if (lastRow.cells[2].textContent !== "") {
    // กำหนดค่าลงในเซลล์
    lastRow.cells[0].textContent = cell0;
    lastRow.cells[1].textContent = cell1;
}

// หาค่ารหัสที่มากที่สุดในคอลัมน์รหัสของแถว
var maxRowCode = 0;
var seenCodes = new Set();

for (var i = 1; i < table.rows.length; i++) {
    var currentRowCode = parseInt(table.rows[i].cells[0].innerText.trim());
    
    if (!isNaN(currentRowCode) && !seenCodes.has(currentRowCode)) {
        seenCodes.add(currentRowCode);
        if (currentRowCode > maxRowCode) {
            maxRowCode = currentRowCode;
        }
    }
}

// สร้างรหัสและบิลตามสถานะ
for (var i = table.rows.length - 1; i >= 1; i--) {
    var status = table.rows[i].cells[11].innerText.trim();
    if (status === "ชำระครบ" || status === "อยู่ในสัญญา" || status === "ครบชำระ" || status === "เลยสัญญา" || status === "เบล็คลิช" || status === "ยึดทรัพย์") {
        // เพิ่มรหัสและบิลในแถวที่มีสถานะเป็นหนึ่งในสถานะที่กำหนด
        if (table.rows[i].cells[2].innerText.trim() !== "") {
            table.rows[i].cells[0].innerText = maxRowCode-1 + (table.rows.length - i);
            table.rows[i].cells[1].innerText = 1;
        }
    } else if (status === "ต่อดอก") {
        // เพิ่มรหัสและบิลในแถวที่มีสถานะเป็น "ต่อดอก"
        if (table.rows[i].cells[2].innerText.trim() !== "") {
            if (i + 1 < table.rows.length) {
                if (table.rows[i + 1].cells[11].innerText.trim() === "ชำระครบ") {
                    table.rows[i].cells[0].innerText = parseInt(table.rows[i + 1].cells[0].innerText.trim())+1;
                    table.rows[i].cells[1].innerText = 1; // เซ็ตค่าใหม่ของบิลเป็น 1 เมื่อเงื่อนไขตรวจสอบว่า cell11 เป็น "ชำระครบ"
                } else {
                    table.rows[i].cells[0].innerText = parseInt(table.rows[i + 1].cells[0].innerText.trim());
                    table.rows[i].cells[1].innerText = parseInt(table.rows[i + 1].cells[1].innerText.trim())+1;
                }
            } else {
                table.rows[i].cells[0].innerText = 1; // ให้รหัสเป็น 1 เพราะไม่มีค่าใด ๆ ในแถวถัดไป
                table.rows[i].cells[1].innerText = 1; // ให้บิลเป็น 1
            }
        }
    }
}














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




