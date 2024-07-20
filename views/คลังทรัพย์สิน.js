function redirectToContractPage2() {
    window.location.href = '/คลังทรัพย์สิน.html';
}

function redirectToContractPage3() {
    window.location.href = '/ขายทรัพย์สิน.html';
}




async function displaySeizureData() {
    try {
        const response = await fetch('/api/seize-assets');
        const data = await response.json();

        const tableBody = document.getElementById("seizureData").querySelector('tbody');
        tableBody.innerHTML = ''; // Clear the table before adding new data


        // For each seizure, create a new row
        data.forEach((seizure, index) => {
            const row = tableBody.insertRow();
            row.id = `row-${seizure._id}`; // Set the ID for the row

            row.innerHTML = `
                <td>${data.length - index}</td> <!-- Reverse index order -->
                <td>${seizure.id_card_number}</td>
                <td>${seizure.contract_number}</td>
                <td>${seizure.bill_number}</td>
                <td>${seizure.seizureDate}</td>
                <td>${seizure.principal}</td>
                <td>${seizure.seizureCost}</td>
                <td>${seizure.totalproperty}</td>
                <td>${seizure.assetName}</td>
                <td>${seizure.assetDetails}</td>
                <td>${seizure.status}</td>
                <td>
                    <button onclick="redirectToEdit('${seizure._id}')">แก้ไข</button>
                    <button onclick="deleteSeizure('${seizure._id}')">ลบ</button>
                </td>
                <td><button onclick="handleSell('${seizure._id}', '${seizure.contract_number}','${seizure.bill_number}','${seizure.id_card_number}', '${seizure.totalproperty}', '${encodeURIComponent(seizure.assetName)}', '${encodeURIComponent(seizure.assetDetails)}')">ขาย</button></td>
            `;
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    }
}




// บันทึกขายทรัพย์
function handleSell(seizure_id, contract_number, bill_number, id_card_number, totalproperty, assetName, assetDetails) {
    try {
        const row = document.getElementById(`row-${seizure_id}`);
        if (row) {
            window.location.href = `บันทึกขายทรัพย์.html?seizure_id=${seizure_id}&contract_number=${contract_number}&bill_number=${bill_number}&id_card_number=${id_card_number}&totalproperty=${totalproperty}&assetName=${encodeURIComponent(assetName)}&assetDetails=${encodeURIComponent(assetDetails)}`;
        } else {
            console.error('Row not found for ID:', seizure_id);
        }
    } catch (error) {
        console.error('Error handling sell:', error.message);
    }
}




//ลบข้อมูลทรัย์
async function deleteSeizure(seizureId) {
    try {
        const confirmDelete = confirm("คุณต้องการลบทรัพย์สินนี้หรือไม่?");
        if (!confirmDelete) {
            return; // หากผู้ใช้ยกเลิกการลบ จะไม่ดำเนินการต่อ
        }
        
        const response = await fetch(`/api/seize-assets/${seizureId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log(data); // แสดงข้อมูลที่ได้จากการลบในคอนโซล

        // ลบแถวในตารางหลังจากลบข้อมูลที่เซิร์ฟเวอร์
        const rowToRemove = document.getElementById(`row-${seizureId}`);
        if (rowToRemove) {
            rowToRemove.remove();
        } else {
            console.error("ไม่พบแถวที่ต้องการลบในตาราง");
        }

        // รีเฟรชข้อมูลหลังจากที่ลบเสร็จสิ้น
        displaySeizureData();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error.message);
    }
}

// เรียกใช้ฟังก์ชันเพื่อแสดงข้อมูลการยึดทรัพย์
displaySeizureData();
