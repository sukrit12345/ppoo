// ฟังก์ชันสำหรับรับพารามิเตอร์จาก URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// รับค่าจาก URL พารามิเตอร์ id และ id_card_number
const id = getQueryParam('id');
const idCardNumber = getQueryParam('id_card_number');

// ตรวจสอบค่าพารามิเตอร์ใน console
console.log('ID:', id);
console.log('ID Card Number:', idCardNumber);

// แสดง idCardNumber ใน span ที่มี id "id_card_number"
if (idCardNumber) {
    document.getElementById('id_card_number').innerText = idCardNumber;
} else {
    document.getElementById('id_card_number').innerText = 'ไม่มีข้อมูล';
}

// ตรวจสอบว่ามีพารามิเตอร์ id หรือ id_card_number หรือไม่
if (id || idCardNumber) { // เปลี่ยนเป็น OR เพื่อค้นหาทั้งสองแบบ
    // เรียก API เพื่อค้นหาข้อมูลลูกหนี้หรือเจ้าหนี้
    fetch(`/api/search?id=${id || ''}&id_card_number=${idCardNumber || ''}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // ตรวจสอบข้อมูลที่ได้รับจาก API
            console.log('Data from API:', data);

            if (data.role === 'user' && data.data) {
                // แสดงเลขบัตรประชาชนของลูกหนี้
                // document.getElementById('id_card_number').innerText = data.data.id_card_number || 'ไม่มีข้อมูล'; // ใช้ค่าใน idCardNumber แทน
            } else if (data.role === 'creditor' && data.data) {
                // แสดงชื่อร้านของเจ้าหนี้
                document.getElementById('store_name').innerText = data.data.username || 'ไม่มีข้อมูล';
            } else {
                alert('ไม่พบข้อมูลลูกหนี้หรือเจ้าหนี้');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('ไม่พบข้อมูลลูกหนี้');
        });
} else {
    alert('กรุณาระบุ id และเลขบัตรประชาชนใน URL');
}









// ฟังก์ชันสำหรับดึงข้อมูลจาก API 
function fetchLoanAndRefundData(id, idCardNumber) {
    if (id && idCardNumber) {
        fetch(`refunds-with-loans?id=${id}&id_card_number=${idCardNumber}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // แปลง response เป็น JSON
            })
            .then(data => {
                console.log('Data from API:', data);
                console.log('Loans data:', data.loans);
                console.log('Refunds data:', data.refunds);
                displayDataInTable(data); // เรียกแสดงข้อมูลในตาราง
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {
        console.error('Missing id or id_card_number');
    }
}


// ฟังก์ชันแสดงข้อมูลในตาราง
// ฟังก์ชันแสดงข้อมูลในตาราง
function displayDataInTable(data) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // เคลียร์ตารางก่อน

    // เรียงลำดับข้อมูลก่อนแสดงผล
    const sortedLoans = data.loans.sort((a, b) => {
        // เปรียบเทียบ contract_number
        if (a.contract_number !== b.contract_number) {
            return b.contract_number - a.contract_number; // เรียงมากไปน้อย
        }
        // ถ้า contract_number เท่ากันให้เปรียบเทียบ bill_number
        return b.bill_number - a.bill_number; // เรียงมากไปน้อย
    });

    sortedLoans.forEach(loan => {
        // ค้นหาการคืนเงินที่ตรงกันด้วย contract_number และ bill_number
        const refund = data.refunds.find(ref => 
            Number(ref.contract_number) === loan.contract_number &&
            Number(ref.bill_number) === loan.bill_number
        );

        const row = `
            <tr>
                <td>${loan.contract_number || '-'}</td>
                <td>${loan.bill_number || '-'}</td>
                <td>${loan.loanDate || '-'}</td>
                <td>${loan.returnDate || '-'}</td>
                <td>${loan.principal || '-'}</td>
                <td>${loan.totalInterest || '-'}</td>
                <td>${loan.totalInterest2 || '-'}</td>
                <td>${loan.totalInterest3 || '-'}</td>
                <td>${loan.totalInterest4 || '-'}</td>
                <td>${loan.totalRefund || '-'}</td>
                <td>${loan.status || '-'}</td>
                <td>${refund ? refund.return_date : '-'}</td>
                <td>${refund ? refund.refund_principal : '-'}</td>
                <td>${refund ? refund.refund_interest : '-'}</td>
                <td>${refund ? refund.debtAmount : '-'}</td>
                <td>${refund ? refund.total_refund2 : '-'}</td>
                <td>${refund ? refund.totalInterest5 : '-'}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// เรียกฟังก์ชันเพื่อดึงข้อมูลจาก API และแสดงในตารางเมื่อโหลดหน้า
fetchLoanAndRefundData(id, idCardNumber);



