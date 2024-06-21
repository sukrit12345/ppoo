//รับข้อมูล เลขบปชช ชื่อ นามสกุล
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);

    // ดึงค่า id_card_number และแสดงใน HTML
    const idCardNumber = urlParams.get('id_card_number');
    document.getElementById('id-card-number').textContent = idCardNumber ? idCardNumber : "N/A";

    // ดึงค่า fname และแสดงใน HTML
    const firstName = urlParams.get('fname');
    document.getElementById('first-name').textContent = firstName ? firstName : "N/A";

    // ดึงค่า lname และแสดงใน HTML
    const lastName = urlParams.get('lname');
    document.getElementById('last-name').textContent = lastName ? lastName : "N/A";

    // ดึงค่า manager และแสดงใน HTML
    const manager = urlParams.get('manager');
    document.getElementById('manager').textContent = manager ? manager : "N/A";

    // ดึงค่า manager และแสดงใน HTML
    const manager2 = urlParams.get('manager2');
    document.getElementById('manager2').textContent = manager2 ? manager2 : "N/A";
});




//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มสัญญา
function redirectToContractPage2() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');
    const manager2 = urlParams.get('manager2');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/สัญญา.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager)+
                   '&manager2=' + encodeURIComponent(manager2);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}



//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มคืนเงิน
function redirectToContractPage3() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');
    const manager2 = urlParams.get('manager2');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/คืนเงิน.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager)+
                   '&manager2=' + encodeURIComponent(manager2);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}



//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มส่วนเเบ่ง
function redirectToContractPage4() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');
    const manager2 = urlParams.get('manager2');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/ส่วนเเบ่ง.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager)+
                   '&manager2=' + encodeURIComponent(manager2);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}

//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มกำไร/ขาดทุน
function redirectToContractPage5() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');
    const manager2 = urlParams.get('manager2');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/กำไรขาดทุน.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager)+
                   '&manager2=' + encodeURIComponent(manager2);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}







document.addEventListener("DOMContentLoaded", function () {
    displayProfitSharingData(); // เรียกใช้งานฟังก์ชันเพื่อแสดงข้อมูลแบ่งกำไร
});

async function displayProfitSharingData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idCardNumber = urlParams.get('id_card_number');
        const response = await fetch(`/get-profit-sharing-data/${idCardNumber}`); // เรียกข้อมูลจากเซิร์ฟเวอร์
        const data = await response.json(); // แปลงข้อมูลที่ได้รับมาเป็น JSON

        // เรียงลำดับข้อมูล
        data.sort((a, b) => {
            const dateA = new Date(a.returnDate); 
            const dateB = new Date(b.returnDate);
            if (dateB - dateA !== 0) {
                return dateB - dateA; // เปรียบเทียบ returnDate จากใหม่ไปเก่า
            }
            if (b.contract_number !== a.contract_number) {
                return b.contract_number.localeCompare(a.contract_number); // เปรียบเทียบ contract_number จากมากไปน้อย
            }
            return b.bill_number.localeCompare(a.bill_number); // เปรียบเทียบ billNumber จากมากไปน้อย
        });

        const tableBody = document.querySelector('#c tbody');

        data.forEach(profit => {
            const row = tableBody.insertRow(); // Add a new row to the beginning of tableBody
            row.id = `row-${profit._id}`; // Set id for the row

            // เพิ่มข้อมูลลงในแถว
            row.innerHTML = `
                <td>${profit.contract_number}</td>
                <td>${profit.bill_number}</td>
                <td>${profit.returnDate}</td>
                <td>${profit.initialProfit}</td>
                <td>${profit.collectorName ? profit.collectorName : '-'}</td>
                <td>${profit.collectorShare ? profit.collectorShare : 0}</td>
                <td>${profit.initialProfit2}</td>
                <td>${profit.manager ? profit.manager : '-'}</td>
                <td>${profit.managerShare ? profit.managerShare : 0}</td>
                <td>${profit.totalShare}</td>
                <td>${profit.netProfit}</td>
                <td> 
                    <button onclick="redirectToEdit('${profit._id}', '${profit.id_card_number}', '${profit.fname}', '${profit.lname}', '${profit.manager}', '${profit.contract_number}', '${profit.bill_number}')">แก้ไข</button>
                    <button onclick="redirectToDelete('${profit._id}', '${profit.id_card_number}')">ลบ</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    }
}


// ลบข้อมูลส่วนแบ่ง
function redirectToDelete(objectId, id_card_number) {
    const confirmation = confirm('คุณต้องการลบส่วนแบ่งนี้หรือไม่?');

    if (confirmation) {
        fetch(`/api/delete-profit-sharing/${objectId}?id_card_number=${id_card_number}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete profit');
            }
            console.log('Profit deleted successfully');
            // ลบแถวที่มี ObjectId ออกจาก DOM
            const rowElement = document.getElementById(`row-${objectId}`);
            if (rowElement) {
                rowElement.remove();
            }
        })
        .catch(error => console.error('Error deleting profit:', error));
    }
}