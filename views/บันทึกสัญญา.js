// ฟังก์ชันสำหรับรับพารามิเตอร์ URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// ฟังก์ชันสำหรับดึงหมายเลขสัญญาสูงสุดจากเซิร์ฟเวอร์
async function fetchMaxContractNumber(idCardNumber) {
    try {
        const response = await fetch(`/api/max-contract-number?id_card_number=${idCardNumber}`);
        const data = await response.json();
        return data.maxContractNumber || 0; // ตรวจสอบว่า maxContractNumber ไม่ใช่ null หรือ undefined
    } catch (error) {
        console.error('Error fetching max contract number:', error);
        return 0;
    }
}

// ฟังก์ชันสำหรับตั้งค่าหมายเลขสัญญาใหม่
async function setNewContractNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    const contractNumberParam = urlParams.get('contract_number');
    
    if (contractNumberParam) {
        // ใช้หมายเลขสัญญาจากพารามิเตอร์ URL
        document.getElementById('contract_number').value = contractNumberParam;
    } else {
        // สร้างหมายเลขสัญญาใหม่
        const idCardNumber = document.getElementById('id_card_number').value;
        if (idCardNumber) {
            const maxContractNumber = await fetchMaxContractNumber(idCardNumber);
            const newContractNumber = parseInt(maxContractNumber, 10) + 1; // เพิ่มค่า +1 จากหมายเลขสัญญาสูงสุด
            document.getElementById('contract_number').value = newContractNumber;
        }
    }
}

// เรียกใช้ฟังก์ชันตั้งค่าหมายเลขสัญญาใหม่เมื่อโหลดหน้าหรือเมื่อจำเป็น
window.onload = function() {
    setNewContractNumber();
};


// กำหนดค่า id_card_number จากพารามิเตอร์ URL
window.onload = function() {
    console.log('window.onload เรียกใช้');
    const idCardNumber = getUrlParameter('id_card_number');
    const fname = getUrlParameter('fname');
    const lname = getUrlParameter('lname');
    const manager = getUrlParameter('manager');
    const manager2 = getUrlParameter('manager2');
    const billNumber = getUrlParameter('bill_number');

    if (idCardNumber) {
        console.log('พารามิเตอร์ id_card_number พบ:', idCardNumber);
        document.getElementById('id_card_number').value = idCardNumber;
        setNewContractNumber(); // เรียกใช้ฟังก์ชันตั้งค่าหมายเลขสัญญา
    } else {
        console.log('ไม่พบพารามิเตอร์ URL id_card_number');
    }

    if (fname) {
        console.log('พารามิเตอร์ fname พบ:', fname);
        document.getElementById('fname').value = fname;
    } else {
        console.log('ไม่พบพารามิเตอร์ URL fname');
    }

    if (lname) {
        console.log('พารามิเตอร์ lname พบ:', lname);
        document.getElementById('lname').value = lname;
    } else {
        console.log('ไม่พบพารามิเตอร์ URL lname');
    }

    if (manager) {
        console.log('พารามิเตอร์ manager พบ:', manager);
        document.getElementById('manager').value = manager;
    } else {
        console.log('ไม่พบพารามิเตอร์ URL manager');
    }
    if (manager2) {
        console.log('พารามิเตอร์ manager2 พบ:', manager2);
        document.getElementById('manager2').value = manager2;
    } else {
        console.log('ไม่พบพารามิเตอร์ URL manager');
    }

    if (billNumber) {
        console.log('พารามิเตอร์ bill_number พบ:', billNumber);
        document.getElementById('bill_number').value = billNumber;
    } else {
        console.log('ไม่พบพารามิเตอร์ URL bill_number');
        // ตั้งค่าหมายเลขบิลเป็น 1 ถ้าไม่มีพารามิเตอร์
        document.getElementById('bill_number').value = 1;
    }

    

    // แสดงวันที่ปัจจุบัน
    function setLoanDate() {
        var today = new Date();
        var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
        var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
        document.getElementById('loanDate').value = today.getFullYear() + '-' + month + '-' + day;
    }

    
    // เรียกใช้ฟังก์ชัน setLoanDate เมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
    setLoanDate();

    // คำนวณระยะเวลากู้
    document.getElementById('loanDate').addEventListener('change', calculateLoanPeriod);
    document.getElementById('returnDate').addEventListener('change', calculateLoanPeriod);

    function calculateLoanPeriod() {
        var loanDate = new Date(document.getElementById('loanDate').value);
        var returnDate = new Date(document.getElementById('returnDate').value);
        var timeDiff = Math.abs(returnDate.getTime() - loanDate.getTime());
        var loanPeriod = Math.ceil(timeDiff / (1000 * 3600 * 24)); // แปลงมิลลิวินาทีเป็นวันและปัดขึ้น
        document.getElementById('loanPeriod').value = loanPeriod;
    }

    // คำนวณวันคืน
    document.getElementById('loanDate').addEventListener('change', calculateReturnDate);
    document.getElementById('loanPeriod').addEventListener('input', calculateReturnDate);

    function calculateReturnDate() {
        var loanDate = new Date(document.getElementById('loanDate').value);
        var loanPeriod = parseInt(document.getElementById('loanPeriod').value);
        
        if (!isNaN(loanPeriod)) {
            var returnDate = new Date(loanDate.getTime() + (loanPeriod * 24 * 60 * 60 * 1000));
            var year = returnDate.getFullYear();
            var month = (returnDate.getMonth() + 1 < 10) ? '0' + (returnDate.getMonth() + 1) : returnDate.getMonth() + 1;
            var day = (returnDate.getDate() < 10) ? '0' + returnDate.getDate() : returnDate.getDate();
            var formattedReturnDate = year + '-' + month + '-' + day;
            document.getElementById('returnDate').value = formattedReturnDate;
        }
    }

    // คำนวณดอกเบี้ยทั้งหมดและเงินที่ต้องคืน
    function calculateInterest() {
        var principal = parseFloat(document.getElementById('principal').value); // เงินต้น
        var duration = parseInt(document.getElementById('loanPeriod').value); // ระยะเวลากู้ (วัน)
        var interestRate = parseFloat(document.getElementById('interestRate').value); // อัตราดอกเบี้ยต่อวัน (%)
    
        if (isNaN(principal) || isNaN(duration) || isNaN(interestRate)) {
            document.getElementById('totalInterest').value = ''; // เคลียร์ค่าใน input field "ดอกเบี้ยทั้งหมด"
            document.getElementById('totalRefund').value = ''; // เคลียร์ค่าใน input field "เงินที่ต้องคืนทั้งหมด"
            return;
        }
    
        var dailyInterest = (principal * interestRate) / 100;
        var totalInterest = dailyInterest * duration;
    
        document.getElementById('totalInterest').value = totalInterest;
    
        var totalPayment = principal + totalInterest;
    
        document.getElementById('totalRefund').value = totalPayment;
    }

    document.getElementById('principal').addEventListener('input', calculateInterest);
    document.getElementById('loanPeriod').addEventListener('input', calculateInterest);
    document.getElementById('interestRate').addEventListener('input', calculateInterest);
};










// ดึงค่า loanId จาก URL เพื่อแสดงข้อมูลสัญญาเมื่อกดปุ่มแก้ไข
const urlParams = new URLSearchParams(window.location.search);
const loanId = urlParams.get('loan_id');

if (loanId) {
    fetch(`/api/loan/${loanId}`)
        .then(response => response.json())
        .then(loan => {
            document.getElementById('manager').value = loan.manager;
            document.getElementById('id_card_number').value = loan.id_card_number;
            document.getElementById('fname').value = loan.fname;
            document.getElementById('lname').value = loan.lname;
            document.getElementById('contract_number').value = loan.contract_number;
            document.getElementById('bill_number').value = loan.bill_number;
            document.getElementById('loanDate').value = loan.loanDate;
            document.getElementById('loanPeriod').value = loan.loanPeriod;
            document.getElementById('returnDate').value = loan.returnDate;
            document.getElementById('principal').value = loan.principal;
            document.getElementById('interestRate').value = loan.interestRate;
            document.getElementById('totalInterest').value = loan.totalInterest;
            document.getElementById('totalRefund').value = loan.totalRefund;
            document.getElementById('store_assets').value = loan.store_assets;
            document.getElementById('icloud_assets').value = loan.icloud_assets;
        })
        .catch(error => console.error('Error fetching loan data:', error));
}

// กดปุ่มบันทึกจะทำการอัปเดตข้อมูล
function updateLoan(event) {
    event.preventDefault();
    const form = document.getElementById('loanForm');
    const formData = new FormData(form);

    fetch(`/api/loan/${loanId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('อัปเดตข้อมูลสัญญาเรียบร้อยแล้ว');
        }
    })
    .catch(error => console.error('Error updating loan data:', error));
}
