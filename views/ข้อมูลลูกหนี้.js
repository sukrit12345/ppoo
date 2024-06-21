//เเสดงข้อมูลลงตารางลูกหนี้
document.addEventListener("DOMContentLoaded", function() {
    fetchDataAndPopulateTable();
});









function fetchDataAndPopulateTable() {
    fetch('/api/debtor-data')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('debtor-table-body');
            tableBody.innerHTML = ''; // Clear any existing rows

            // Reverse the data array
            data.reverse().forEach(async (row, index) => {
                const tr = document.createElement('tr');
                tr.id = `row-${row._id}`; // Set ID for the row
                tr.innerHTML = `
                    <td>${data.length - index}</td> <!-- Reverse the index -->
                    <td>${row.date}</td>
                    <td>${row.id_card_number}</td>
                    <td>${row.fname}</td>
                    <td>${row.lname}</td>
                    <td>-</td> <!-- Placeholder for loan.returnDate -->
                    <td>-</td> <!-- Placeholder for loan.principal -->
                    <td>-</td> <!-- Placeholder for loan.totalInterest4 -->
                    <td>-</td> <!-- Placeholder for loan.totalRefund -->
                    <td>-</td> <!-- Placeholder for loan.status -->
                    <td>-</td> <!-- Placeholder for Actions -->
                    <td>-</td> <!-- Placeholder for Contract -->
                    <td>-</td>
                    <td>${row.province}</td>
                    <td>${row.manager}</td>
                    <td>${row.manager2}</td>
                    <td> 
                        <button onclick="redirectToEdit('${row._id}')">แก้ไข</button>
                        <button onclick="redirectToDelete('${row._id}', '${row.id_card_number}')">ลบ</button>
                    </td>
                    <td><button onclick="redirectToContract('${row._id}')">สัญญา</button></td> 
                `;
                tableBody.appendChild(tr);

                try {
                    // Fetch the latest loan information for the debtor
                    const response = await fetch(`/api/loaninformations/${row._id}`);
                    const loanData = await response.json();

                    // Update the row with loan information
                    const loanRow = document.getElementById(`row-${row._id}`);
                    loanRow.cells[5].innerText = loanData.returnDate;
                    loanRow.cells[6].innerText = loanData.principal;
                    loanRow.cells[7].innerText = loanData.totalInterest4;
                    loanRow.cells[8].innerText = loanData.totalRefund;
                    loanRow.cells[9].innerHTML = loanData.status;
                    loanRow.cells[9].style.color = loanData.status;

                } catch (error) {
                    console.error('Error fetching loan information:', error);
                }
            });

            calculateTotalIDCard();
        })
        .catch(error => console.error('Error fetching data:', error));
}





//เเก้ไขข้อมูลลูกหนี้
function redirectToEdit(debtorId) {
    window.location.href = `บันทึกข้อมูลลูกหนี้.html?id=${debtorId}`;
}




// ลบข้อมูลลูกหนี้พร้อมโหลดหน้าใหม่
function redirectToDelete(objectId) {
    // ข้อความยืนยัน
    const confirmation = confirm(`คุณต้องการลบข้อมูลลูกหนี้นี้หรือไม่?`);

    // ถ้าผู้ใช้ยืนยันการลบ
    if (confirmation) {
        // ส่งคำขอลบข้อมูลไปยัง API โดยใช้ fetch
        fetch(`/api/delete-debtor/${objectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete debtor');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // ลบแถวที่มี ObjectId ออกจาก DOM
            const rowElement = document.getElementById(`row-${objectId}`);
            if (rowElement) {
                rowElement.remove();
            }
            // โหลดหน้าใหม่
            location.reload();
        })
        .catch(error => console.error('Error deleting debtor:', error));
    }
}




//ไปหน้าสัญญา
function redirectToContract(id) {
    const row = document.getElementById(`row-${id}`);
    if (row) {
        const id_card_number = row.cells[2].textContent;
        const fname = row.cells[3].textContent;
        const lname = row.cells[4].textContent;
        const manager = row.cells[14].textContent;
        const manager2 = row.cells[15].textContent;

        window.location.href = `สัญญา.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}&manager2=${manager2}`;
    } else {
        console.error('Row not found for ID:', id);
    }
}












//ค้นหาเลขบัตรประชาชน13หลัก
function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.trim(); // ตัดช่องว่างที่อาจเกิดขึ้นได้
    
    // ตรวจสอบว่าเลขบัตรประชาชนมีความยาว 13 หลักหรือไม่
    if (filter.length !== 13 || isNaN(filter)) {
      alert("โปรดป้อนเลขบัตรประชาชนที่ถูกต้อง (13 หลัก)");
      return;
    }
  
    // ค้นหาในทุกคอลัมน์
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");
  
    for (i = 0; i < tr.length; i++) {
      var found = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่าพบข้อมูลหรือไม่
  
      for (j = 0; j < tr[i].cells.length; j++) {
        td = tr[i].getElementsByTagName("td")[j];
        if (td) {
          txtValue = td.textContent || td.innerText;
          // เปรียบเทียบข้อมูลในคอลัมน์กับค่าที่ค้นหา
          if (txtValue.trim() === filter) {
            found = true;
            break;
          }
        }
      }
  
      if (found) {
        tr[i].style.display = ""; // แสดงแถวที่พบข้อมูล
      } else {
        // ตรวจสอบว่าอิลิเมนต์ที่กำลังตรวจสอบเป็น <th> หรือไม่
        if (tr[i].getElementsByTagName("th").length === 0) {
          tr[i].style.display = "none"; // ซ่อนแถวที่ไม่พบข้อมูล
        }
      }
    }
}


  



//ค้นหาชื่อจังหวัด
function customSearch3() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("newSearchInput3"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[13]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 16 (index 15)
        if (td) {
            txtValue = td.textContent || td.innerText;
            // ใช้เงื่อนไขเพิ่มเติมเพื่อให้ค้นหาได้ทั้งตัวเล็กและตัวใหญ่
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


//ค้นหาชื่อเเอดมิน
function customSearch1() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("newSearchInput1"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[14]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 16 (index 15)
        if (td) {
            txtValue = td.textContent || td.innerText;
            // ใช้เงื่อนไขเพิ่มเติมเพื่อให้ค้นหาได้ทั้งตัวเล็กและตัวใหญ่
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
} 

//ค้นหาวันที่คืน
function customSearch2() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("newSearchInput2"); // เปลี่ยน ID ใหม่ที่นี่
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[5]; // แก้ index เป็นตำแหน่งที่ต้องการค้นหา ในที่นี้คือ คอลัมน์ที่ 16 (index 15)
        if (td) {
            txtValue = td.textContent || td.innerText;
            // ใช้เงื่อนไขเพิ่มเติมเพื่อให้ค้นหาได้ทั้งตัวเล็กและตัวใหญ่
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}



//คำนวณค้นหาสถานะ
window.onload = function() {
    searchIdCard2();
};
function searchIdCard2() {
    var statusFilter, table, tr, i, found;
    statusFilter = document.getElementById("statusFilter").value;

    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        found = false;

        if (tr[i].getElementsByTagName("td").length > 0) {
            if (tr[i].cells[9].innerText.trim() === statusFilter || statusFilter === "") {
                found = true;
            }

            if (found) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    

    // Call calculateTotalPrincipalAmount() after filtering
    calculateTotalPrincipalAmount();
    calculateTotalInterestAmount();
    calculateTotalRefundAmount();
    
}




//คำนวณเงินต้นทั้งหมดตามสถานะ
function calculateTotalPrincipalAmount() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalPrincipalAmount = 0;

    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0 && tr[i].style.display !== "none") {
            var principalAmount = parseFloat(tr[i].cells[6].innerText.trim());
            if (!isNaN(principalAmount)) {
                totalPrincipalAmount += principalAmount;
            }
        }
    }

    var resultContainer = document.getElementById("totalPrincipalAmount");
    resultContainer.textContent = "เงินต้นทั้งหมด: " + totalPrincipalAmount.toLocaleString() + " บาท";
}


//คำนวณดอกเบี้ยทั้งหมดตามสถานะ
function calculateTotalInterestAmount() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalInterestAmount = 0;

    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0 && tr[i].style.display !== "none") {
            var interestAmount = parseFloat(tr[i].cells[7].innerText.trim());
            if (!isNaN(interestAmount)) {
                totalInterestAmount += interestAmount;
            }
        }
    }

    var resultContainer = document.getElementById("totalInterestAmount");
    resultContainer.textContent = "ดอกเบี้ยทั้งหมด: " + totalInterestAmount.toLocaleString() + " บาท";
}


//คำนวณเงินที่ต้องคืนทั้งหมดตามสถานะ
function calculateTotalRefundAmount() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalRefundAmount = 0;

    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0 && tr[i].style.display !== "none") {
            var refundAmount = parseFloat(tr[i].cells[8].innerText.trim());
            if (!isNaN(refundAmount)) {
                totalRefundAmount += refundAmount;
            }
        }
    }

    var resultContainer = document.getElementById("totalRefundAmount");
    resultContainer.textContent = "เงินที่ต้องคืนทั้งหมด: " + totalRefundAmount.toLocaleString() + " บาท";
}




//คำนวณลูกหนี้ในระบบทั้งหมด
function calculateTotalIDCard() {
            var table = document.querySelector("table");
            var tr = table.getElementsByTagName("tr");
            var totalid_card = [];

            // Start from i = 1 to skip the table header row
            for (var i = 1; i < tr.length; i++) {
                if (tr[i].getElementsByTagName("td").length > 0) {
                    // Get the ID card number from the cell at index 2 (starting from 0)
                    var id_card = tr[i].cells[2].innerText.trim();
                    if (id_card !== "") {
                        totalid_card.push(id_card);
                    }
                }
            }

            // Count unique ID card numbers
            var uniqueIDCardCount = new Set(totalid_card).size;

            // Display the result in the element with id "totalid_card"
            var resultContainer = document.getElementById("totalid_card");
            resultContainer.textContent = "ลูกหนี้ในระบบทั้งหมด: " + uniqueIDCardCount + " คน";
        }



//คำนวณลูกหนี้อยู่ในสัญญา
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateTotalDebtorsInContract() when the HTML document is loaded
    calculateTotalDebtorsInContract();
});

function calculateTotalDebtorsInContract() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalDebtors = [];

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the status from the cell at index 8 (starting from 0)
            var status = tr[i].cells[8].innerText.trim(); // Changed from 8 to 7

            // Check if the status contains the phrase "อยู่ในสัญญา"
            if (status.includes("อยู่ในสัญญา")) {
                totalDebtors.push("dummy"); // Just push a dummy value to count the debtors
            }
        }
    }

    // Count total debtors in contract
    var totalDebtorsCount = totalDebtors.length;

    // Display the result in the element with id "totalDebtorsInContract"
    var resultContainer = document.getElementById("totalDebtorsInContract");
    resultContainer.textContent = "ลูกหนี้อยู่ในสัญญา: " + totalDebtorsCount + ' คน';
}



//คำนวณลูกหนี้ครบกำหนดสัญญา
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateTotalDebtorsWithContracts() when the HTML document is loaded
    calculateTotalDebtorsWithContracts();
});

function calculateTotalDebtorsWithContracts() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalDebtors = [];

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the status from the cell at index 8 (starting from 0)
            var status = tr[i].cells[8].innerText.trim();

            // Check if the status contains the phrase "ครบกำหนดชำระ"
            if (status.includes("ครบสัญญา")) {
                totalDebtors.push("dummy"); // Just push a dummy value to count the debtors
            }
        }
    }

    // Count total debtors with contracts
    var totalDebtorsCount = totalDebtors.length;

    // Display the result in the element with id "debtorsWithContracts"
    var resultContainer = document.getElementById("debtorsWithContracts");
    resultContainer.textContent = "ลูกหนี้ครบกำหนดสัญญา: " + totalDebtorsCount + ' คน';
}




//คำนวณลูกหนี้เลยกำหนดสัญญา
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateTotalDebtorsWhoExceededContracts() when the HTML document is loaded
    calculateTotalDebtorsWhoExceededContracts();
});

function calculateTotalDebtorsWhoExceededContracts() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalDebtors = [];

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the status from the cell at index 8 (starting from 0)
            var status = tr[i].cells[8].innerText.trim();

            // Check if the status contains the phrase "เลยกำหนดสัญญา"
            if (status.includes("เลยสัญญา")) {
                totalDebtors.push("dummy"); // Just push a dummy value to count the debtors
            }
        }
    }

    // Count total debtors who exceeded contracts
    var totalDebtorsCount = totalDebtors.length;

    // Display the result in the element with id "debtorsWhoExceededContracts"
    var resultContainer = document.getElementById("debtorsWhoExceededContracts");
    resultContainer.textContent = "ลูกหนี้เลยกำหนดสัญญา: " + totalDebtorsCount + ' คน';
}




//คำนวณลูกหนี้ชำระครบ
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateFullyPaidDebtors() when the HTML document is loaded
    calculateFullyPaidDebtors();
});

function calculateFullyPaidDebtors() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var fullyPaidDebtors = [];

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the status from the cell at index 8 (starting from 0)
            var status = tr[i].cells[8].innerText.trim();

            // Check if the status contains the phrase "ชำระครบ"
            if (status.includes("ชำระครบ")) {
                fullyPaidDebtors.push("dummy"); // Just push a dummy value to count the fully paid debtors
            }
        }
    }

    // Count total fully paid debtors
    var totalFullyPaidDebtorsCount = fullyPaidDebtors.length;

    // Display the result in the element with id "fullyPaidDebtors"
    var resultContainer = document.getElementById("fullyPaidDebtors");
    resultContainer.textContent = "ลูกหนี้ชำระครบ: " + totalFullyPaidDebtorsCount + ' คน';
}




//คำนวณลูกหนี้เเบล็คลิช
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateDebtorsBlacklist() when the HTML document is loaded
    calculateDebtorsBlacklist();
});

function calculateDebtorsBlacklist() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var debtorsBlacklist = [];

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the status from the cell at index 8 (starting from 0)
            var status = tr[i].cells[8].innerText.trim();

            // Check if the status contains the phrase "อยู่ในสัญญา"
            if (status.includes("เเบล็คลิช")) {
                debtorsBlacklist.push("dummy"); // Just push a dummy value to count the debtors
            }
        }
    }

    // Count total debtors on blacklist
    var totalDebtorsBlacklistCount = debtorsBlacklist.length;

    // Display the result in the element with id "debtorsBlacklist"
    var resultContainer = document.getElementById("debtorsBlacklist");
    resultContainer.textContent = "ลูกหนี้เเบล็คลิช: " + totalDebtorsBlacklistCount + ' คน';
}




//คำนวณเงินต้นปล่อยสะสมทั้งหมด
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateTotalPrincipal() when the HTML document is loaded
    calculateTotalPrincipal();
});

function calculateTotalPrincipal() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalPrincipal = 0;

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the principal amount from the cell at index 8 (starting from 0)
            var principal = parseFloat(tr[i].cells[9].innerText.trim());
            if (!isNaN(principal)) {
                totalPrincipal += principal;
            }
        }
    }

    // Display the result in the element with id "totalPrincipal"
    var resultContainer = document.getElementById("totalPrincipal");
    resultContainer.textContent = "เงินต้นปล่อยสะสมทั้งหมด: " + totalPrincipal.toLocaleString() + " บาท";
}



//คำนวณดอกเบี้ยสะสมทั้งหมด
document.addEventListener("DOMContentLoaded", function() {
    // Call calculateTotalAccumulatedInterest() when the HTML document is loaded
    calculateTotalAccumulatedInterest();
});

function calculateTotalAccumulatedInterest() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalShareAmount = 0; // เปลี่ยนชื่อตัวแปรเป็น totalShareAmount

    // Start from i = 1 to skip the table header row
    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            // Get the share amount from the cell at index 9 (starting from 0)
            var share = parseFloat(tr[i].cells[10].innerText.trim()); // คำนวณค่าที่เซลล์ที่ 10
            if (!isNaN(share)) {
                totalShareAmount += share; // เพิ่มค่าลงในตัวแปร totalShareAmount
            }
        }
    }

    // Display the result in the element with id "totalAccumulatedInterest"
    var resultContainer = document.getElementById("totalAccumulatedInterest");
    resultContainer.textContent = "ดอกเบี้ยได้รับสะสมทั้งหมด: " + totalShareAmount.toLocaleString() + " บาท";
}



//คำนวณกำไรขั้นต้นสะสมทั้งหมด
document.addEventListener("DOMContentLoaded", function() {
    // เรียกใช้ calculateTotalNetProfit() เมื่อเอกสาร HTML โหลดเสร็จ
    calculateTotalNetProfit();
});

function calculateTotalNetProfit() {
    var table = document.querySelector("table");
    var tr = table.getElementsByTagName("tr");
    var totalNetProfit = 0;

    for (var i = 1; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td").length > 0) {
            var profit = parseFloat(tr[i].cells[11].innerText.trim());
            if (!isNaN(profit)) {
                totalNetProfit += profit;
            }
        }
    }

    // แสดงผลลัพธ์ใน element ที่กำหนด เช่น div หรือ span
    var resultContainer = document.getElementById("totalNetProfit");
    resultContainer.textContent = "กำไรขั้นต้นสะสมทั้งหมด: " + totalNetProfit.toLocaleString() + " บาท";
}





//เปลี่ยนสีสถานะ
// ดึงตาราง HTML โดยใช้ ID
var table = document.getElementById("your_table_id");

// เลือกเซลล์ทั้งหมดที่อยู่ในคอลัมน์ที่ 12 และตรวจสอบว่ามีข้อความ "ชำระครบ" หรือไม่
var cells = document.querySelectorAll('#your_table_id td:nth-child(9)');
  
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













