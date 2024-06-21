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

        // Sort data
        sales.sort((a, b) => {
            const dateA = new Date(a.sell_date);
            const dateB = new Date(b.sell_date);
            if (dateB - dateA !== 0) {
                return dateB - dateA; // Compare sell dates from newest to oldest
            }
            if (b.contract_number !== a.contract_number) {
                return b.contract_number.localeCompare(a.contract_number); // Compare contract numbers in descending order
            }
            return b.bill_number.localeCompare(a.bill_number); // Compare bill numbers in descending order
        });
        
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
