  //เเสดงวันที่ปัจจุบัน
  // เรียกฟังก์ชัน setLoanDate เมื่อหน้าเว็บโหลด
  window.onload = setLoanDate;

  function setLoanDate() {
      // สร้างวันที่ปัจจุบัน
      var today = new Date();

      // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
      var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
      var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

      // กำหนดค่าวันที่ให้กับ input element "loanDate"
      document.getElementById('loanDate').value = today.getFullYear() + '-' + month + '-' + day;
  }




  //คำนวณระยะเวลากู้
  document.getElementById('loanDate').addEventListener('change', calculateLoanPeriod);
  document.getElementById('returnDate').addEventListener('change', calculateLoanPeriod);

  function calculateLoanPeriod() {
      var loanDate = new Date(document.getElementById('loanDate').value);
      var returnDate = new Date(document.getElementById('returnDate').value);

      var timeDiff = Math.abs(returnDate.getTime() - loanDate.getTime());
      var loanPeriod = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days and round up
      document.getElementById('loanPeriod').value = loanPeriod;
  }

  //คำนวณวันคืน
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

    //คำนวณดอกเบี้ยทั้งหมดเเละรวมเงินที่ต้องคืน
    // ฟังก์ชันที่เรียกเมื่อมีการเปลี่ยนแปลงในค่าของ input fields
    function calculateInterest() {
        // ดึงค่าจาก input fields
        var principal = parseFloat(document.getElementById('principal').value); // เงินต้น
        var duration = parseInt(document.getElementById('loanPeriod').value); // ระยะเวลากู้ (วัน)
        var interestRate = parseFloat(document.getElementById('interestRate').value); // ดอกเบี้ยต่อวัน (%)
    
        // ตรวจสอบว่าข้อมูลถูกต้องหรือไม่
        if (isNaN(principal) || isNaN(duration) || isNaN(interestRate)) {
          // หากข้อมูลไม่ถูกต้อง ไม่ต้องทำการคำนวณ
          document.getElementById('totalInterest').value = ''; // เคลียร์ค่าใน input field "ดอกเบี้ยทั้งหมด"
          document.getElementById('totalRefund').value = ''; // เคลียร์ค่าใน input field "เงินที่ต้องคืนทั้งหมด"
          return; // ออกจากฟังก์ชัน
        }
    
        // คำนวณดอกเบี้ยต่อวัน
        var dailyInterest = (principal * interestRate) / 100;
    
        // คำนวณดอกเบี้ยทั้งหมด
        var totalInterest = dailyInterest * duration;
    
        // แสดงผลลัพธ์ใน input field "ดอกเบี้ยทั้งหมด"
        document.getElementById('totalInterest').value = totalInterest;
    
        // คำนวณเงินที่ต้องคืนทั้งหมด
        var totalPayment = principal + totalInterest;
    
        // แสดงผลลัพธ์ใน input field "เงินที่ต้องคืนทั้งหมด"
        document.getElementById('totalRefund').value = totalPayment;
      }
    
      // เรียกใช้งานฟังก์ชัน calculateInterest เมื่อมีการเปลี่ยนแปลงในค่าของ input fields
      document.getElementById('principal').addEventListener('input', calculateInterest);
      document.getElementById('loanPeriod').addEventListener('input', calculateInterest);
      document.getElementById('interestRate').addEventListener('input', calculateInterest);

