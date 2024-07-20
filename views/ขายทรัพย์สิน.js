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




