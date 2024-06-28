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





document.addEventListener("DOMContentLoaded", async function() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idCardNumber = urlParams.get('id_card_number');
        const response = await fetch(`/api/refunds/${idCardNumber}`);
        const refunds = await response.json();

        // Sort the data
        refunds.sort((a, b) => {
            const dateA = new Date(a.return_date);
            const dateB = new Date(b.return_date);
            if (dateB - dateA !== 0) {
                return dateB - dateA; // Compare return_date from newest to oldest
            }
            if (b.contract_number !== a.contract_number) {
                return b.contract_number.localeCompare(a.contract_number); // Compare contract_number in descending order
            }
            return b.bill_number.localeCompare(a.bill_number); // Compare bill_number in descending order
        });

        const refundData = document.getElementById('refundData');

        refunds.forEach(refund => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${refund.contract_number}</td>
                <td>${refund.bill_number}</td> 
                <td>${refund.principal}</td> 
                <td>${refund.totalInterest4}</td>
                <td>${refund.totalRefund}</td>
                <td>${refund.return_date}</td>
                <td>${refund.refund_principal}</td>
                <td>${refund.refund_interest}</td>
                <td>${refund.debtAmount}</td>
                <td>${refund.total_refund2}</td>
                <td>${refund.totalInterest5}</td>
                <td>${refund.initial_profit}</td>
                <td>${refund.status}</td> 
                <td>
                    <button onclick="editRefund('${refund._id}')">แก้ไข</button>
                    <button onclick="deleteRefund('${refund._id}')">ลบ</button>
                </td>
                <td>
                   <button onclick="divided(
                     '${refund._id}',
                     '${refund.id_card_number}',
                     '${refund.lname}',
                     '${refund.fname}',
                     '${refund.manager}',
                     '${refund.contract_number}',
                     '${refund.bill_number}',
                     '${refund.initial_profit}'
                   )">ส่วนแบ่ง</button>
                </td>
            `;

            refundData.appendChild(row);
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
});





// ลบข้อมูลคืนเงิน
function deleteRefund(refundId) {
    const confirmation = confirm(`คุณต้องการลบการคืนเงินนี้หรือไม่?`);
    if (confirmation) {
        // ส่งคำขอ DELETE ไปยังเซิร์ฟเวอร์
        fetch(`/api/refunds/${refundId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('เกิดข้อผิดพลาดในการลบข้อมูล');
                }
                // รีโหลดหน้าหลังจากลบสำเร็จ
                window.location.reload();
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error.message);
                // แสดงข้อความแจ้งเตือนถ้ามีข้อผิดพลาด
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            });
    }
}





function divided(refundId, idCardNumber, firstName, lastName, manager, contractNumber, billNumber, initial_profit) {
    // ทำการ redirect ไปยังหน้าบันทึกส่วนแบ่ง พร้อมส่งค่าผ่าน URL query string
    const queryString = `?refundId=${refundId}&id_card_number=${idCardNumber}&fname=${firstName}&lname=${lastName}&manager=${manager}&contract_number=${contractNumber}&bill_number=${billNumber}&initial_profit=${initial_profit}`;
    window.location.href = `/บันทึกส่วนเเบ่ง.html${queryString}`;
}



