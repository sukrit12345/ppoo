  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // คำนวณวันที่ปัจจุบัน
  // เรียกฟังก์ชัน setDate เมื่อหน้าเว็บโหลด
  window.onload = setDate;
  
  function setDate() {
      // สร้างวันที่ปัจจุบัน
      var today = new Date();
  
      // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
      var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
      var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
  
      // กำหนดค่าวันที่ให้กับ input element "return_date_input"
      document.getElementById('return_date_input').value = today.getFullYear() + '-' + month + '-' + day;
  }

  


    //คำนวณเงินเเบ่ง
    // ฟังก์ชันคำนวณส่วนแบ่งของผู้จัดการและผู้ดูแล
    function calculateShares() {
        // รับค่าจำนวนเงินกำไรเริ่มต้น
        var initialProfit = parseFloat(document.getElementById('initial_profit_input').value);
        
        // รับค่าอัตราเปอร์เซ็นต์ส่วนแบ่งผู้จัดการ
        var managerSharePercentage = parseFloat(document.getElementById('manager_share_percentage_input').value);
        
        // คำนวณส่วนแบ่งของผู้จัดการ
        var managerShare = (managerSharePercentage / 100) * initialProfit;
        
        // แสดงผลลัพธ์ในฟิลด์ส่วนแบ่งผู้จัดการ
        document.getElementById('manager_share_input').value = managerShare.toFixed(); // แสดงทศนิยมสองตำแหน่ง


        // รับค่าอัตราเปอร์เซ็นต์ส่วนแบ่งผู้ดูแล
        var supervisorSharePercentage = parseFloat(document.getElementById('supervisor_share_percentage_input').value);
        
        // คำนวณส่วนแบ่งของผู้ดูแล
        var supervisorShare = (supervisorSharePercentage / 100) * initialProfit;
        
        // แสดงผลลัพธ์ในฟิลด์ส่วนแบ่งผู้ดูแล
        document.getElementById('supervisor_share_input').value = supervisorShare.toFixed(); // แสดงทศนิยมสองตำแหน่ง


        
        // รับค่าอัตราเปอร์เซ็นต์ส่วนแบ่งหัวหน้าสาขา
        var branchHeadSharePercentage = parseFloat(document.getElementById('branch_head_share_percentage_input').value);
        
        // คำนวณส่วนแบ่งของหัวหน้าสาขา
        var branchHeadShare = (branchHeadSharePercentage / 100) * initialProfit;
        
        // แสดงผลลัพธ์ในฟิลด์ส่วนแบ่งหัวหน้าสาขา
        document.getElementById('branch_head_share_input').value = branchHeadShare.toFixed(); // แสดงทศนิยมสองตำแหน่ง
        
        
        // รับค่าจำนวนเงินที่เเบ่ง
        var refundedAmount = parseFloat(document.getElementById('manager_share_input').value) +
                            parseFloat(document.getElementById('supervisor_share_input').value) +
                            parseFloat(document.getElementById('branch_head_share_input').value);
      
        
        // คำนวณและแสดงผลลัพธ์ในฟิลด์กำไรสุทธิ
        document.getElementById('final_profit_input').value = (initialProfit - refundedAmount).toFixed(); // แสดงทศนิยมสองตำแหน่ง
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
        window.location.href = "ส่วนเเบ่ง.html";
        // ลบป๊อปอัพออก
        document.body.removeChild(popup);
      }, 1200); // 3000 มิลลิวินาที (3 วินาที)
    });
  });