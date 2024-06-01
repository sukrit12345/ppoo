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


//ส่งเลขบปชช ชื่อ นามสกุลไปหน้าบันทึกสัญญา
function redirectToContractPage() {
    // ดึงค่า id_card_number, fname, และ lname จาก URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const fname = urlParams.get('fname');
    const lname = urlParams.get('lname');
    const manager = urlParams.get('manager');


    if (idCardNumber && fname && lname && manager ) {
        // สร้าง URL ใหม่เพื่อไปยังหน้า "บันทึกสัญญา.html" โดยเพิ่มเฉพาะค่า id_card_number, fname, และ lname
        const newURL = `/บันทึกสัญญา.html?id_card_number=${encodeURIComponent(idCardNumber)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&manager=${encodeURIComponent(manager)}`;
        // นำ URL ใหม่ไปที่หน้าที่ต้องการ
        window.location.href = newURL;
    } else {
        console.error('ส่งไม่สำเร็จ');
    }
}


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



//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มคืนเงิน
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














async function displayLoanData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idCardNumber = urlParams.get('id_card_number');

        const response = await fetch(`/api/loan-data?id_card_number=${idCardNumber}`);
        const data = await response.json();

        const tableBody = document.getElementById("loanData");
        tableBody.innerHTML = ''; // ล้างข้อมูลในตารางก่อนที่จะเพิ่มข้อมูลใหม่

        // เรียงข้อมูลตามวันที่บันทึก
        data.sort((a, b) => new Date(a.loanDate) - new Date(b.loanDate));

        data.forEach(loan => {
            const row = tableBody.insertRow(0); // เพิ่มแถวใหม่ในส่วนต้นของ tableBody
            row.id = `row-${loan._id}`; // กำหนด id ให้กับแถว

            row.innerHTML = `
                <td>${loan.contract_number}</td>
                <td>${loan.bill_number}</td>
                <td>${loan.loanDate}</td>
                <td>${loan.loanPeriod} วัน</td>
                <td>${loan.returnDate}</td>
                <td>${loan.principal}</td>
                <td>${loan.interestRate}%</td>
                <td>${loan.totalInterest}</td>
                <td>${loan.totalInterest2}</td>
                <td>${loan.totalInterest3 !== undefined && loan.totalInterest3 !== null ? loan.totalInterest3 : 0}</td>
                <td>${loan.totalInterest4}</td>
                <td>${loan.totalRefund}</td>
                <td>${loan.totalRepayment === '-' ? loan.totalRepayment : loan.totalRepayment + ' วัน'}</td>
                <td>${loan.status}</td>
                <td>${loan.daysUntilReturn === '-' ? loan.daysUntilReturn : loan.daysUntilReturn + ' วัน'}</td>
                <td> 
                    <button onclick="redirectToEdit('${loan._id}', '${loan.id_card_number}', '${loan.fname}', '${loan.lname}', '${loan.manager}', '${loan.contract_number}', '${loan.bill_number}')">แก้ไข</button>
                    <button onclick="redirectToDelete('${loan._id}', '${loan.id_card_number}')">ลบ</button>
                    <button onclick="redirectToclose('${loan._id}', '${loan.id_card_number}')">ปิด</button>
                </td>
                <td><button onclick="seizeAssets('${loan._id}', '${loan.id_card_number}', '${loan.fname}', '${loan.lname}', '${loan.manager}', '${loan.contract_number}', '${loan.bill_number}')">ยึดทรัพย์</button></td>
                <td><button onclick="refundMoney('${loan._id}', '${loan.id_card_number}', '${loan.fname}', '${loan.lname}', '${loan.manager}', '${loan.contract_number}', '${loan.bill_number}')">คืนเงิน</button></td>
            `;
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    }
}





// แก้ไขสัญญา
function redirectToEdit(loanId, idCardNumber, fname, lname, manager, contract_number, bill_number) {
    window.location.href = `/บันทึกสัญญา.html?loan_id=${encodeURIComponent(loanId)}&id_card_number=${encodeURIComponent(idCardNumber)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&manager=${encodeURIComponent(manager)}&contract_number=${encodeURIComponent(contract_number)}&bill_number=${encodeURIComponent(bill_number)}`;
}



// ไปหน้าบันทึกยึดทรัพย์
function seizeAssets(loanId, idCardNumber, fname, lname, manager, contract_number, bill_number) {
    window.location.href = `/บันทึกยึดทรัพย์.html?loan_id=${encodeURIComponent(loanId)}&id_card_number=${encodeURIComponent(idCardNumber)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&manager=${encodeURIComponent(manager)}&contract_number=${encodeURIComponent(contract_number)}&bill_number=${encodeURIComponent(bill_number)}`;
}


// ไปหน้าบันทึกคืนเงิน
function refundMoney(loanId, idCardNumber, fname, lname, manager, contract_number, bill_number) {
    window.location.href = `/บันทึกคืนเงิน.html?loan_id=${encodeURIComponent(loanId)}&id_card_number=${encodeURIComponent(idCardNumber)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&manager=${encodeURIComponent(manager)}&contract_number=${encodeURIComponent(contract_number)}&bill_number=${encodeURIComponent(bill_number)}`;
}


// ลบข้อมูลสัญญา
function redirectToDelete(objectId, idCardNumber) {
    const confirmation = confirm(`คุณต้องการลบสัญญานี้หรือไม่?`);

    if (confirmation) {
        fetch(`/api/delete-loan/${objectId}?id_card_number=${idCardNumber}`, { // เพิ่ม id_card_number ใน URL
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete loan');
            }
            console.log('Loan deleted successfully');
            // ลบแถวที่มี ObjectId ออกจาก DOM
            const rowElement = document.getElementById(`row-${objectId}`);
            if (rowElement) {
                rowElement.remove();
            }
        })
        .catch(error => console.error('Error deleting loan:', error));
    }
}

window.onload = function () {
    displayLoanData();
};






















































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














































