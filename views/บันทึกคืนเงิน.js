  //เเสดงวันที่ปัจจุบันเเละวันที่ต้องคืน
  // เรียกฟังก์ชัน setReturnDateInput เมื่อหน้าเว็บโหลด
  window.onload = setReturnDateInput;

  function setReturnDateInput() {
      // สร้างวันที่ปัจจุบัน
      var today = new Date();

      // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
      var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
      var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

      // กำหนดค่าวันที่ให้กับ input element "return_date_input"
      document.getElementById('return_date_input').value = today.getFullYear() + '-' + month + '-' + day;
  }


 //คำนวณรวมเงินที่คืน
 // เรียกฟังก์ชัน calculateTotalRefund เมื่อมีการเปลี่ยนแปลงในเงินต้นคืนหรือดอกเบี้ยคืน
 document.getElementById('refund_principal_input').addEventListener('input', calculateTotalRefund);
 document.getElementById('refund_interest_input').addEventListener('input', calculateTotalRefund);

 function calculateTotalRefund() {
     var principal = parseFloat(document.getElementById('refund_principal_input').value);
     var interest = parseFloat(document.getElementById('refund_interest_input').value);

     // ตรวจสอบว่า principal และ interest เป็นตัวเลขที่ถูกต้อง
     if (!isNaN(principal) && !isNaN(interest)) {
         var totalRefund = principal + interest;

         // กำหนดค่าเงินคืนทั้งหมดให้กับ input element ของ "total_refund_input"
         document.getElementById('total_refund_input').value = totalRefund;
     }
 }  



 //เเสดงข้อมูลบันทึกสำเร็จ
 document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // หยุดการส่งคำขอฟอร์ม
  
      // สร้าง Element HTML เพื่อแสดงข้อความ "บันทึกสำเร็จ" ในป๊อปอัพ
      const popup = document.createElement("div");
      popup.classList.add("popup"); // เพิ่มคลาส "popup" ที่กำหนดไว้ใน CSS
      const successMessage = document.createElement("p");
      successMessage.textContent = "บันทึกสำเร็จ";
      successMessage.classList.add("popup-text"); // เพิ่มคลาส "popup-text" ที่กำหนดไว้ใน CSS
      popup.appendChild(successMessage);
      document.body.appendChild(popup);
  
      // รอ 3 วินาทีก่อนที่จะเปลี่ยนที่อยู่ URL
      setTimeout(function() {
        // เปลี่ยน URL ไปยังหน้าคลังทรัพย์.html หลังจากการแสดงป๊อปอัพ
        window.location.href = "คืนเงิน.html";
        // ลบป๊อปอัพออก
        document.body.removeChild(popup);
      }, 1200); // 3000 มิลลิวินาที (3 วินาที)
    });
  });