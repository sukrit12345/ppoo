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


});



//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มสัญญา
function redirectToContractPage2() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');


    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/สัญญา.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);

    
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


    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/คืนเงิน.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);

    
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


    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/ส่วนเเบ่ง.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);

    
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


    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/กำไรขาดทุน.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);

    
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
        const creditorId = localStorage.getItem('id_shop'); // ดึง creditorId จาก localStorage

        if (!idCardNumber || !creditorId) {
            throw new Error('id_card_number or creditorId is missing');
        }

        const response = await fetch(`/get-profit-sharing-data/${idCardNumber}?creditorId=${creditorId}`); // เรียกข้อมูลจากเซิร์ฟเวอร์
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // แปลงข้อมูลที่ได้รับมาเป็น JSON

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
                <td>${profit.managerName ? profit.managerName : '-'}</td>
                <td>${profit.managerShare ? profit.managerShare : 0}</td>
                <td>${profit.receiverName ? profit.receiverName : '-'}</td>
                <td>${profit.receiverShare ? profit.receiverShare : 0}</td>
                <td>${profit.totalShare ? profit.totalShare : 0}</td>
                <td>${profit.netProfit}</td>
                <td>
                    <button onclick="redirectToEdit('${profit._id}')"><i class="fas fa-eye"></i>ดู</button>
                    <button onclick="redirectToDelete('${profit._id}', '${profit.id_card_number}')"><i class="fas fa-trash-alt"></i>ลบ</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    }
}





function redirectToEdit(id) {
    // เปลี่ยนเส้นทางไปยังหน้าบันทึกส่วนเเบ่ง พร้อมกับส่ง id เป็นพารามิเตอร์ใน URL
    window.location.href = `บันทึกส่วนเเบ่ง.html?_id=${id}`;
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