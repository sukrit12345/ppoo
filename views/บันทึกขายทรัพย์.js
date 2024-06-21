document.addEventListener("DOMContentLoaded", function() {
    // เมื่อ DOM โหลดเสร็จสมบูรณ์
    var urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าตามชื่อพารามิเตอร์ที่ต้องการ และแปลงเป็นข้อความที่ถูกต้อง
    var idCardNumber = decodeURIComponent(urlParams.get('id_card_number'));
    var contractNumber = decodeURIComponent(urlParams.get('contract_number'));
    var billNumber = decodeURIComponent(urlParams.get('bill_number'));
    var totalProperty = decodeURIComponent(urlParams.get('totalproperty'));
    var assetName = decodeURIComponent(urlParams.get('assetName'));
    var assetDetails = decodeURIComponent(urlParams.get('assetDetails'));
    var seizureId = decodeURIComponent(urlParams.get('seizure_id'));

    // ตรวจสอบค่าที่ดึงได้
    console.log("ID Card Number:", idCardNumber);
    console.log("Contract Number:", contractNumber);
    console.log("Bill Number:", billNumber);
    console.log("Total Property:", totalProperty);
    console.log("Asset Name:", assetName);
    console.log("Asset Details:", assetDetails);
    console.log("Seizure ID:", seizureId); // ตรวจสอบ seizure_id

    // กำหนดค่าที่ดึงได้ในฟอร์ม
    document.getElementById("id_card_number").value = idCardNumber;
    document.getElementById("contract_number").value = contractNumber;
    document.getElementById("bill_number").value = billNumber;
    document.getElementById("totalproperty").value = totalProperty;
    document.getElementById("assetName").value = assetName;
    document.getElementById("assetDetails").value = assetDetails;
    document.getElementById("seizure_id").value = seizureId; // กำหนดค่า seizure_id

    // เพิ่ม event listener เพื่อคำนวณกำไรสุทธิ
    document.getElementById("sellamount").addEventListener("input", calculateNetProfit);
    document.getElementById("totalproperty").addEventListener("input", calculateNetProfit);
});


// ฟังก์ชันคำนวณกำไรสุทธิ
function calculateNetProfit() {
    var sellamount = parseFloat(document.getElementById("sellamount").value) || 0;
    var totalproperty = parseFloat(document.getElementById("totalproperty").value) || 0;
    var netprofit = sellamount - totalproperty;
    document.getElementById("netprofit").value = netprofit;
}

// ฟังก์ชันคำนวณกำไรสุทธิ
function calculateNetProfit() {
    var sellamount = parseFloat(document.getElementById("sellamount").value) || 0;
    var totalproperty = parseFloat(document.getElementById("totalproperty").value) || 0;
    var netprofit = sellamount - totalproperty;
    document.getElementById("netprofit").value = netprofit;
}

// เรียกฟังก์ชัน setReturnDateInput เมื่อหน้าเว็บโหลด
window.onload = setReturnDateInput;

function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "sell_date"
    document.getElementById('sell_date').value = today.getFullYear() + '-' + month + '-' + day;
}
