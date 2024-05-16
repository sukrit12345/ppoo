
//สร้างปุ่มลบเเละเเก้ไข
// เลือกแถวทั้งหมดในตารางยกเว้นแถวหัว
var tableRows = document.querySelectorAll("#c tr:not(:first-child)");

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
