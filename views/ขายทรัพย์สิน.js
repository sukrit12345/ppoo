function redirectToContractPage2() {
    window.location.href = '/คลังทรัพย์สิน.html';
}

function redirectToContractPage3() {
    window.location.href = '/ขายทรัพย์สิน.html';
}





async function fetchSales() {
    try {
        const response = await fetch('/sales');
        const sales = await response.json();
        
        const table = document.getElementById('m').getElementsByTagName('tbody')[0];

        // Clear existing table rows
        table.innerHTML = '';

        // Add new rows for each sale
        sales.forEach((sale, index) => {
            const row = table.insertRow();

            row.innerHTML = `
                <td>${sales.length - index}</td> <!-- Index in descending order -->
                <td>${sale.id_card_number}</td>
                <td>${sale.contract_number}</td>
                <td>${sale.bill_number}</td>
                <td>${sale.sell_date}</td>
                <td>${sale.totalproperty}</td>
                <td>${sale.assetName}</td>
                <td>${sale.assetDetails}</td>
                <td>${sale.sellamount}</td>
                <td>${sale.netprofit}</td>
                <td>
                    <button onclick="redirectToEdit('${sale._id}')">แก้ไข</button>
                    <button onclick="deleteSale('${sale._id}')">ลบ</button>
                </td>
            `;
        });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการขาย:', err);
    }
}

//เเก้ไข
function redirectToEdit(saleId) {
    // Implement redirection logic here
    console.log('Redirect to edit:', saleId);
}



//ลบทิ้ง
async function deleteSale(saleId) {
    const confirmDelete = confirm("คุณต้องการลบรายการขายทรัพย์สินนี้หรือไม่?");
    if (!confirmDelete) {
        return; // ยกเลิกการลบถ้าผู้ใช้ไม่ยืนยัน
    }
    try {
        const response = await fetch(`/sales/${saleId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('ไม่สามารถลบข้อมูลได้');
        }
        // Reload sales data after deletion
        fetchSales();
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', err);
    }
}

// Call fetchSales function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchSales);




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