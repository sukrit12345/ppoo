document.addEventListener("DOMContentLoaded", async function() {
    // ดึงค่าจาก URL query string
    const urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าตามชื่อพารามิเตอร์ที่ต้องการ
    const refundId = urlParams.get('refundId');
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');
    const contractNumber = urlParams.get('contract_number');
    const billNumber = urlParams.get('bill_number');
    const initial_profit = urlParams.get('initial_profit');

    // ตรวจสอบค่าที่ดึงได้
    console.log("Refund ID:", refundId);
    console.log("ID Card Number:", idCardNumber);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Manager:", manager);
    console.log("Contract Number:", contractNumber);
    console.log("Bill Number:", billNumber);
    console.log("initial_profit:", initial_profit);

    // ใช้ค่าที่ดึงได้ในการปรับแต่งหรือใช้งานต่อไป
    document.getElementById("initial_profit").value = initial_profit || '';
    document.getElementById("id_card_number").value = idCardNumber || '';
    document.getElementById("fname").value = firstName || '';
    document.getElementById("lname").value = lastName || '';
    document.getElementById("manager").value = manager || '';
    document.getElementById("contract_number").value = contractNumber || '';
    document.getElementById("bill_number").value = billNumber || '';
    document.getElementById("refundId").value = refundId || ''; // อัปเดตตรงนี้

    // ค้นหาข้อมูลจากฐานข้อมูล Manager
    const managerData = await Manager.findOne({ nickname: manager });

    if (managerData) {
        console.log("Manager Data:", managerData);
        document.getElementById("bankName").value = managerData.bankName || '';
        document.getElementById("accountNumber").value = managerData.accountNumber || '';
    } else {
        console.log('Manager not found!');
        // Clear bankName and accountNumber if manager data is not found
        document.getElementById("bankName").value = '';
        document.getElementById("accountNumber").value = '';
    }
});




//วันที่ปัจจุบัน
window.onload = setDate;

function setDate() {
    // Create current date
    var today = new Date();

    // Format month and day to have leading zero if needed
    var month = (today.getMonth() + 1).toString().padStart(2, '0');
    var day = today.getDate().toString().padStart(2, '0');

    // Set the value of the date input field
    document.getElementById('return_date_input').value = today.getFullYear() + '-' + month + '-' + day;
}

 // ฟังก์ชันคำนวณส่วนเเบ่งทั้งหมด
 function calculateShares() {
    const initialProfit = parseFloat(document.getElementById('initial_profit').value) || 0;
    const collectorShare = parseFloat(document.getElementById('collector_share').value) || 0;
    const managerShare = parseFloat(document.getElementById('manager_share').value) || 0;

    const initial_profit2 = initialProfit - collectorShare;
    const totalShare = collectorShare + managerShare;
    const netProfit = initialProfit - totalShare;

    document.getElementById('total_share').value = totalShare.toFixed(0);
    document.getElementById('net_profit').value = netProfit.toFixed(0);
    document.getElementById('initial_profit2').value = initial_profit2.toFixed(0);
}

// ฟังก์ชันคำนวณส่วนเเบ่งเเอดมิน
function calculateManagerShare() {
    const initialProfit2 = parseFloat(document.getElementById('initial_profit2').value) || 0;
    const managerShare2 = parseFloat(document.getElementById('manager_share2').value) || 0;

    const managerShare = initialProfit2 * managerShare2 / 100;

    document.getElementById('manager_share').value = managerShare.toFixed(0);
}

// เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนแปลงค่า initial_profit2 หรือ manager_share2
document.getElementById('initial_profit2').addEventListener('input', calculateManagerShare);
document.getElementById('manager_share2').addEventListener('input', calculateManagerShare);

// เรียกใช้ฟังก์ชันคำนวณค่าเริ่มต้น
calculateManagerShare();