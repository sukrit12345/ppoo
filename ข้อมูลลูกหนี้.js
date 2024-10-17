

//เเสดงข้อมูลลงตารางลูกหนี้
document.addEventListener("DOMContentLoaded", function() {
    fetchDataAndPopulateTable();
});



//ไอดีร้าน
document.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('id_shop');
    const shopName = localStorage.getItem('shop_name');
    const nickname = localStorage.getItem('nickname');

    console.log('ID:', id);
    console.log('Shop Name:', shopName);
    console.log('Nickname:', nickname);

    // เรียกใช้ฟังก์ชันเช็คสิทธิ์
    await checkAdminAccess(nickname);

    // เรียกใช้ฟังก์ชัน fetchLoanData โดยส่ง id เป็นพารามิเตอร์
    fetchLoanData(id);
});



// จัดการหน้าที่ใช้งานได้ตามตำแหน่ง
const checkAdminAccess = async (nickname) => {
    try {
        const creditorId = localStorage.getItem('id_shop'); // รับค่า creditorId จาก localStorage
        const response = await fetch(`/check_manager/${nickname}?creditorId=${creditorId}`); // ส่งค่า creditorId เป็น query parameter
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        console.log('Manager data:', data); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูล

        if (data.job_position === 'admin') {
            // ปิดลิงก์ที่ไม่อนุญาตสำหรับ admin
            const reportLink = document.querySelector('a[href="รายงานผล.html"]');
            const icloudLink = document.querySelector('a[href="ไอคราว.html"]');
            const adminLink = document.querySelector('a[href="เเอดมิน.html"]');
            const settingsLink = document.querySelector('a[href="ตั้งค่า.html"]'); // เพิ่มการค้นหาลิงก์ตั้งค่า

            if (reportLink) reportLink.style.display = 'none'; // ซ่อนลิงก์รายงานผล
            if (icloudLink) icloudLink.style.display = 'none'; // ซ่อนลิงก์ไอคราว
            if (adminLink) adminLink.style.display = 'none'; // ซ่อนลิงก์เเอดมิน
            if (settingsLink) settingsLink.style.display = 'none'; // ซ่อนลิงก์ตั้งค่า
        } else if (data.job_position === 'assistant_manager') {
            // ปิดลิงก์ที่ไม่อนุญาตสำหรับ manager
            const reportLink = document.querySelector('a[href="รายงานผล.html"]');
            const settingsLink = document.querySelector('a[href="ตั้งค่า.html"]'); // ค้นหาลิงก์ตั้งค่า

            if (reportLink) reportLink.style.display = 'none'; // ซ่อนลิงก์รายงานผล
            if (settingsLink) settingsLink.style.display = 'none'; // ซ่อนลิงก์ตั้งค่า
        }
    } catch (error) {
        console.error('Error checking manager access:', error);
    }
};





// ฟังก์ชัน fetchDataAndPopulateTable สำหรับดึงข้อมูลและเติมค่าลงในตาราง
async function fetchDataAndPopulateTable() {
    try {
        // ดึง creditorId จาก localStorage
        const creditorId = localStorage.getItem('id_shop');

        // ส่ง creditorId ไปที่เซิร์ฟเวอร์ผ่าน query string
        const response = await fetch(`/api/debtor-data?creditorId=${creditorId}`);
        const data = await response.json();
        
        const tableBody = document.getElementById('debtor-table-body');
        tableBody.innerHTML = ''; // ล้างแถวที่มีอยู่

        for (const [index, row] of data.entries()) {
            const tr = document.createElement('tr');
            tr.id = `row-${row._id}`; // กำหนด ID ให้กับแถว

            // เติมข้อมูลในตาราง
            tr.innerHTML = `
                <td>${data.length - index}</td> <!-- ลำดับที่จากใหม่ไปเก่า -->
                <td>${row.date}</td>
                <td>${row.id_card_number}</td>
                <td>${row.fname}</td>
                <td>${row.lname}</td>
                <td>${row.loanReturnDate || '-'}</td> <!-- Placeholder สำหรับ loan.returnDate -->
                <td>${row.loanPrincipal || '-'}</td> <!-- Placeholder สำหรับ loan.principal -->
                <td>${row.loanTotalInterest4 || '-'}</td> <!-- Placeholder สำหรับ loan.totalInterest4 -->
                <td>${row.loanTotalRefund || '-'}</td> <!-- Placeholder สำหรับ loan.totalRefund -->
                <td>${row.loanStatus || '-'}</td> <!-- Placeholder สำหรับ loan.status -->
                <td>${row.principalSum || '-'}</td> <!-- Placeholder สำหรับ Principal Sum -->
                <td>${row.refundInterestSum || '-'}</td> <!-- Placeholder สำหรับ Refund Interest Sum -->
                <td>${row.principalDifference || '-'}</td> <!-- Placeholder สำหรับ Principal Difference -->
                <td>${row.province}</td>
                <td>${row.manager}</td>
                <td> 
                    <button onclick="redirectToEdit('${row._id}')"><i class="fas fa-pencil-alt"></i>แก้ไข</button>
                    <button onclick="redirectToDelete('${row._id}', '${row.id_card_number}')"><i class="fas fa-trash-alt"></i>ลบ</button>
                </td>
                <td><button onclick="redirectToContract('${row._id}')"><i class="fas fa-cogs"></i> สัญญา</button></td>

            `;
            tableBody.appendChild(tr);

            try {
                // ดึง creditorId จาก localStorage
                const creditorId = localStorage.getItem('id_shop');
                if (!creditorId) {
                    throw new Error('creditorId not found in localStorage');
                }
            
                // Fetch the latest loan information for the debtor
                const loanResponse = await fetch(`/api/loaninformations/${row._id}?creditorId=${creditorId}`);
                const loanData = await loanResponse.json();
            
                console.log('Loan data:', loanData); // Debug loan data
            
                // Update the row with loan information
                const loanRow = document.getElementById(`row-${row._id}`);
                loanRow.cells[5].innerText = loanData.returnDate || '-';
                loanRow.cells[6].innerText = loanData.principal || '-';
                loanRow.cells[7].innerText = loanData.totalInterest4 || '-';
                loanRow.cells[8].innerText = loanData.totalRefund || '-';
                loanRow.cells[9].innerHTML = loanData.status || '-';
                loanRow.cells[9].style.color = loanData.status || 'black';
            
                // Fetch the principal sum for the debtor and update cell 10
                const principalResponse = await fetch(`/api/loan-principal-sum/${row.id_card_number}?creditorId=${creditorId}`);
                const principalData = await principalResponse.json();
                console.log('Principal data:', principalData); // Debug principal data
            
                loanRow.cells[10].innerText = principalData.totalPrincipal || '-';
            
                // Fetch the refund interest sum for the debtor and update cell 11
                const refundInterestResponse = await fetch(`/api/refund-interest-sum/${row.id_card_number}?creditorId=${creditorId}`);
                const refundInterestData = await refundInterestResponse.json();
                console.log('Refund interest data:', refundInterestData); // Debug refund interest data
            
                loanRow.cells[11].innerText = refundInterestData.totalRefundInterest || '-';
            
                // Calculate and update cell 12 with principal difference
                const principalSum = parseFloat(principalData.totalPrincipal) || 0;
                const refundInterestSum = parseFloat(refundInterestData.totalRefundInterest) || 0;
                const principalDifference = refundInterestSum - principalSum;
            
                // Display principal difference with negative sign if less than zero
                loanRow.cells[12].innerText = (principalDifference === 0 || principalDifference === undefined || principalDifference === null) 
                    ? '-' 
                    : (principalDifference < 0 ? `-${Math.abs(principalDifference).toFixed(0)}` : principalDifference.toFixed(0));
            
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            
        }

        calculateTotalIDCard();

    } catch (error) {
        console.error('Error fetching data:', error);
    }
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

        window.location.href = `สัญญา.html?id_card_number=${id_card_number}&fname=${fname}&lname=${lname}&manager=${manager}`;
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



//ค้นหาสถานะ
function updateTotalPrincipal() {
    // ดึงค่าที่เลือกจาก dropdown
    const selectedStatus = document.getElementById("statusFilter").value;
    
    // ดึงตารางและ body ของตาราง
    const table = document.getElementById("your_table_id");
    const tbody = document.getElementById("debtor-table-body");
    
    // ดึงทุกแถวในตาราง
    const rows = tbody.getElementsByTagName("tr");
    
    // วนลูปผ่านแต่ละแถวในตาราง
    for (let i = 0; i < rows.length; i++) {
        const statusCell = rows[i].getElementsByTagName("td")[9]; // คอลัมน์สถานะ (คอลัมน์ที่ 9)
        if (statusCell) {
            const statusText = statusCell.textContent || statusCell.innerText;
            // ถ้าเลือก "ทั้งหมด" ให้แสดงทุกแถว
            if (selectedStatus === "ทั้งหมด") {
                rows[i].style.display = ""; // แสดงแถว
            } else {
                // ถ้าสถานะของแถวตรงกับสถานะที่เลือก ให้แสดงแถว
                if (statusText === selectedStatus) {
                    rows[i].style.display = ""; // แสดงแถว
                } else {
                    rows[i].style.display = "none"; // ซ่อนแถว
                }
            }
        }
    }
}





//ค้นหาชื่อหรือนามสกุล
function customSearch4() {
    const input = document.getElementById("searchInput2").value.toLowerCase();
    const table = document.getElementById("your_table_id");
    const tr = table.getElementsByTagName("tr");
  
    for (let i = 1; i < tr.length; i++) { // เริ่มที่ i=1 เพราะข้ามหัวตาราง
        const tdName = tr[i].getElementsByTagName("td")[3]; // ชื่อ
        const tdSurname = tr[i].getElementsByTagName("td")[4]; // นามสกุล
  
        if (tdName || tdSurname) {
            const nameValue = tdName.textContent || tdName.innerText;
            const surnameValue = tdSurname.textContent || tdSurname.innerText;
  
            // ตรวจสอบว่าชื่อหรือนามสกุลตรงกับที่ค้นหาหรือไม่
            if (nameValue.toLowerCase().indexOf(input) > -1 || surnameValue.toLowerCase().indexOf(input) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
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



//ค้นหาวันที่
$(function() {
    $('#dateRange').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        autoUpdateInput: false, // Don't auto-update the input field
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month')
    });

    // Update input field manually when dates are chosen
    $('#dateRange').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });

    // Clear input field when cancel is clicked
    $('#dateRange').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });
});

function customSearch2() {
    var dateRange = $('#dateRange').val();
    if (dateRange === '') {
        alert("เลือกช่วงเวลาที่ต้องคืน");
        return;
    }
    var dates = dateRange.split(" - ");
    var startDate = moment(dates[0], 'YYYY-MM-DD');
    var endDate = moment(dates[1], 'YYYY-MM-DD');
    var table = document.getElementById("your_table_id");
    var tr = table.getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) { // เริ่มต้นที่ 1 เพื่อข้ามแถวหัวตาราง
        var td = tr[i].getElementsByTagName("td")[5]; // คอลัมน์ที่ต้องการค้นหา (index 1)
        if (td) {
            var txtValue = td.textContent || td.innerText;
            var cellDate = moment(txtValue, 'YYYY-MM-DD');
            if (cellDate.isBetween(startDate, endDate, undefined, '[]')) { // รวมทั้ง startDate และ endDate
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}






//ยอดเงิน ดอกเบี้ย เงินที่ต้องคืน ตามสถานะ
let loanPieChart; // ประกาศตัวแปรกราฟไว้ที่นี่เพื่อใช้ทั่วทั้งสคริปต์

document.addEventListener('DOMContentLoaded', async () => {
    const id = localStorage.getItem('id_shop');

    if (id) {
        try {
            const response = await fetch(`/api/loan-info?id=${id}`);
            const data = await response.json();

            // เก็บข้อมูลที่ได้รับไว้เพื่อใช้งานในฟังก์ชัน updateTotalPrincipal
            window.loanData = data;

            // เรียกใช้ฟังก์ชัน updateTotalPrincipal เป็นครั้งแรกเมื่อโหลดหน้า
            updateTotalPrincipal();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        }
    } else {
        console.error('ไม่พบ ID ของร้านค้าใน localStorage');
    }
});

function updateTotalPrincipal() {
    const selectedStatus = document.getElementById("statusFilter").value;
    const data = window.loanData;

    const filteredData = selectedStatus === "ทั้งหมด"
        ? data
        : data.filter(item => {
            const statusText = item.status.replace(/<.*?>/g, '').trim(); // เอา HTML แท็กออก
            return statusText === selectedStatus; // เปรียบเทียบกับสถานะที่เลือก
        });

    const totalPrincipal = filteredData.reduce((acc, item) => acc + item.totalPrincipal, 0);
    const totalInterest = filteredData.reduce((acc, item) => acc + item.totalInterest, 0);
    const totalAmount = totalPrincipal + totalInterest;

    // แสดงผลในคอนโซล
    console.log(`สถานะ: ${selectedStatus}`);
    console.log(`รวมเงินต้น: ${totalPrincipal.toLocaleString()} บาท`);
    console.log(`รวมดอกเบี้ย: ${totalInterest.toLocaleString()} บาท`);
    console.log(`รวมทั้งหมด: ${totalAmount.toLocaleString()} บาท`);

    // เช็คว่ากราฟถูกสร้างแล้วหรือไม่
    const ctx = document.getElementById('loanPieChart').getContext('2d');
    if (loanPieChart) {
        // ถ้ามีกกราฟอยู่แล้ว ให้เปลี่ยนค่าในกราฟ
        loanPieChart.data.datasets[0].data = [totalPrincipal, totalInterest, totalAmount];
        loanPieChart.data.labels = [
            `เงินต้นปล่อย: ${totalPrincipal.toLocaleString()} บาท`,
            `ดอกเบี้ยที่ต้องได้รับ: ${totalInterest.toLocaleString()} บาท`,
            `รวมเงินที่ต้องได้รับ: ${totalAmount.toLocaleString()} บาท`
        ];
        loanPieChart.update(); // อัปเดตกราฟ
    } else {
        // ถ้ายังไม่มีกราฟ ให้สร้างใหม่
        loanPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    `เงินต้นปล่อย: ${totalPrincipal.toLocaleString()} บาท`,
                    `ดอกเบี้ยที่ต้องได้รับ: ${totalInterest.toLocaleString()} บาท`,
                    `รวมเงินที่ต้องได้รับ: ${totalAmount.toLocaleString()} บาท`
                ],
                datasets: [{
                    label: 'ยอดเงินรวม',
                    data: [totalPrincipal, totalInterest, totalAmount],
                    backgroundColor: [
                        '#ef476f',  
                        '#f78c6b',  
                        '#ffd166'   
                    ],
                    borderWidth: 0,                  
                }]
            },
            
            
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'center',
                        labels: {
                            boxWidth: 20,
                            padding: 5,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const count = tooltipItem.raw;
                                const total = totalPrincipal + totalInterest + totalAmount;
                                const percentage = total ? ((count / total) * 100).toFixed(2) : 0;
                                return `${tooltipItem.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// เรียกใช้ฟังก์ชัน updateTotalPrincipal เมื่อเปลี่ยนค่าใน dropdown
document.getElementById("statusFilter").addEventListener("change", updateTotalPrincipal);









// เเสดงจำนวนลูกหนี้ตามสถานะ
document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('id_shop');

    if (id) {
        fetch(`/api/countStatus?id=${id}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('statusChart').getContext('2d');
                const totalDebtors = data.อยู่ในสัญญา + data.ครบสัญญา + data.เลยสัญญา + data.ชำระครบ + data.ยึดทรัพย์ + data.เเบล็คลิช;

                const statusChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: [
                            `ยึดทรัพย์: ${data.ยึดทรัพย์} คน`,   // '#ef476f' (สีแดง)
                            `เลยสัญญา: ${data.เลยสัญญา} คน`,    // '#f78c6b' (สีส้ม)
                            `ครบกำหนดสัญญา: ${data.ครบสัญญา} คน`, // '#ffd166' (สีเหลือง)
                            `ชำระครบ: ${data.ชำระครบ} คน`,      // '#06d6a0' (สีเขียว)
                            `อยู่ในสัญญา: ${data.อยู่ในสัญญา} คน`, // '#118ab2' (สีน้ำเงิน)
                            `เเบล็คลิช: ${data.เเบล็คลิช} คน`   // '#073b4c' (สีน้ำเงินเข้ม)
                        ],
                        datasets: [{
                            label: 'จำนวนลูกหนี้',
                            data: [
                                data.ยึดทรัพย์,   // สีแดง
                                data.เลยสัญญา,    // สีส้ม
                                data.ครบสัญญา,    // สีเหลือง
                                data.ชำระครบ,     // สีเขียว
                                data.อยู่ในสัญญา, // สีน้ำเงิน
                                data.เเบล็คลิช    // สีน้ำเงินเข้ม
                            ],
                            backgroundColor: [
                                '#ef476f',  // สีแดง
                                '#f78c6b',  // สีส้ม
                                '#ffd166',  // สีเหลือง
                                '#06d6a0',  // สีเขียว
                                '#118ab2',  // สีน้ำเงิน
                                '#073b4c'   // สีน้ำเงินเข้ม
                            ],
                            borderWidth: 0,                             
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                align: 'center',
                                labels: {
                                    boxWidth: 20,
                                    padding: 5,
                                    font: {
                                        size: 12,
                                        weight: 'bold'
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const count = tooltipItem.raw;
                                        const percentage = totalDebtors ? ((count / totalDebtors) * 100).toFixed(2) : 0;
                                        return `${tooltipItem.label}: ${percentage}%`;
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.error('ไม่พบ ID ของร้านค้าใน localStorage');
    }
});









//เเสดงยอดสะสม
async function fetchLoanData(id) {
    if (!id) {
        console.error('id_shop is missing in localStorage.');
        return;
    }

    try {
        const response = await fetch(`/calculate-sum?id=${id}`);

        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// ฟังก์ชันสำหรับแสดงผลรวมในกราฟ
function displayResults(data) {
    const ctx = document.getElementById('loanChart').getContext('2d');
    
    // ทำให้เฉพาะ totalPrincipal และ totalRefundInterest เป็นบวก แต่ profit อาจเป็นลบได้
    const totalPrincipal = Math.abs(data.totalPrincipal);
    const totalRefundInterest = Math.abs(data.totalRefundInterest);
    const profit = data.profit; // ปล่อยให้ profit ยังคงเป็นลบได้

    const totalloan = totalPrincipal + totalRefundInterest + Math.abs(profit); // รวมผลรวมโดยให้ profit เป็น absolute สำหรับการคำนวณเปอร์เซ็นต์

    const loanChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `รวมเงินต้นปล่อย: ${totalPrincipal} บาท`,
                `รวมดอกเบี้ยคืน: ${totalRefundInterest} บาท`,
                `กำไร/ขาดทุน: ${profit} บาท`
            ],
            datasets: [{
                label: 'ยอดเงิน',
                data: [
                    totalPrincipal,
                    totalRefundInterest,
                    profit
                ],
                backgroundColor: [
                    '#ef476f',  
                    '#f78c6b',  
                    '#ffd166'   
                ],
                borderWidth: 0,    
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 20,
                        padding: 5,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const count = tooltipItem.raw; // ไม่ใช้ Math.abs() กับ profit
                            const percentage = totalloan ? ((Math.abs(count) / totalloan) * 100).toFixed(2) : 0;
                            return `${tooltipItem.label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    });
}




























//เเสดงจำนวนหน้าเเจ้งเตือน
document.addEventListener('DOMContentLoaded', () => {
    // ดึงค่าจำนวนแจ้งเตือนจาก localStorage
    const notificationCount = localStorage.getItem('notificationCount');
    if (notificationCount) {
        const notificationLink = document.querySelector('a.active2');
        if (notificationLink) {
            notificationLink.setAttribute('data-count', notificationCount);
        }
    }
});






