$(document).ready(function() {
    // ฟังก์ชันในการจัดการข้อมูล
    function addToTable(data) {
        // เรียงลำดับจากมากไปน้อย
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        let totalIncome = 0;
        let totalExpense = 0;
        let netProfit = 0;
        let debtorMoney = 0;
        let cashMoney = 0;

        // เพิ่มข้อมูลลงในตาราง
        data.forEach((item, index) => {
            // คำนวณผลรวมของแต่ละแถว
            let total = 0;
            total += item.a ? parseFloat(item.a) : 0;
            total += item.b ? parseFloat(item.b) : 0;
            total += item.c ? parseFloat(item.c) : 0;
            total -= item.c2 ? parseFloat(item.c2) : 0;
            total += item.d ? parseFloat(item.d) : 0;
            total -= item.d2 ? parseFloat(item.d2) : 0;

            // คำนวณผลรวมตามประเภท
            if (item.a) totalIncome += parseFloat(item.a);
            if (item.b) totalExpense += parseFloat(item.b);
            if (item.c) debtorMoney += parseFloat(item.c);
            if (item.d) cashMoney += parseFloat(item.d);
            if (item.c2) debtorMoney -= parseFloat(item.c2);
            if (item.d2) cashMoney -= parseFloat(item.d2);

            // เพิ่มข้อมูลลงในตาราง
            $('#accountingTableBody').append(`
                <tr>
                    <td>${data.length - index}</td>
                    <td>${item.date}</td>
                    <td>${item.description}</td>
                    <td>${item.a ? `<span style="color: green;">+${item.a}</span>` : ''}</td>
                    <td>${item.b ? `<span style="color: green;">+${item.b}</span>` : ''}</td>
                    <td>${item.c ? `<span style="color: green;">+${item.c}</span>` : ''}${item.c2 ? `<span style="color: red;">-${item.c2}</span>` : ''}</td>
                    <td>${item.d ? `<span style="color: green;">+${item.d}</span>` : ''}${item.d2 ? `<span style="color: red;">-${item.d2}</span>` : ''}</td>
                </tr>
            `);
        });

        // คำนวณกำไรสุทธิ
        netProfit = totalIncome - totalExpense;

        // แสดงผลรวมใน div
        $('#totalIncome').text(`รายได้: ${totalIncome.toFixed(2)}`);
        $('#totalExpense').text(`ค่าใช้จ่าย: ${totalExpense.toFixed(2)}`);
        $('#netProfit').text(`กำไรสุทธิ: ${netProfit.toFixed(2)}`);
        $('#debtorMoney').text(`เงินที่ลูกหนี้: ${debtorMoney.toFixed(2)}`);
        $('#cashMoney').text(`เงินสด: ${cashMoney.toFixed(2)}`);

        // สร้างแผนภูมิแท่ง
        const ctx = document.getElementById('summaryChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['รายได้', 'ค่าใช้จ่าย', 'กำไรสุทธิ', 'เงินที่ลูกหนี้', 'เงินสด'],
                datasets: [{
                    label: 'สรุปผลตามช่วงเวลา',
                    data: [totalIncome, totalExpense, netProfit, debtorMoney, cashMoney],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // สร้างสัญญาเพื่อเรียกใช้ API
    let promises = [
        $.get('/getLoanInformation1'),
        $.get('/getLoanInformation2'),
        $.get('/getRefundInformation1'),
        $.get('/getRefundInformation2'),
        $.get('/getRefunds'),
        $.get('/getProfitSharings'),
        $.get('/getSeizures'),
        $.get('/getSales'),
        $.get('/getExpenses'),
        $.get('/getIncomes'),
        $.get('/getCapitals')
    ];

    // รวบรวมข้อมูลจาก API ทั้งหมด
    $.when(...promises).done(function(...results) {
        let allData = [];

        // จัดการข้อมูลของแต่ละ API
        results[0][0].forEach(item => {
            allData.push({
                date: item.loanDate,
                description: 'ปล่อยยอดเงินต้น',
                c: item.principal,
                d2: item.principal
            });
        });

        results[1][0].forEach(item => {
            allData.push({
                date: item.loanDate,
                description: 'ค่าเเนะนำ',
                b: item.Recommended,
                d2: item.Recommended
            });
        });

        results[2][0].forEach(item => {
            allData.push({
                date: item.return_date,
                description: 'คืนเงินต้น',
                c2: item.refund_principal,
                d: item.refund_principal
            });
        });

        results[3][0].forEach(item => {
            allData.push({
                date: item.return_date,
                description: 'คืนดอกเบี้ย',
                a: item.refund_interest,
                d: item.refund_interest
            });
        });

        results[4][0].forEach(item => {
            allData.push({
                date: item.return_date,
                description: 'ค่าทวงเก็บจากลูกหนี้',
                a: item.debtAmount,
                d: item.debtAmount
            });
        });

        results[5][0].forEach(item => {
            allData.push({
                date: item.returnDate,
                description: 'ส่วนเเบ่งทั้งหมด',
                b: item.totalShare,
                d2: item.totalShare
            });
        });

        results[6][0].forEach(item => {
            allData.push({
                date: item.seizureDate,
                description: 'ค่ายึดทรัพย์',
                b: item.seizureCost,
                d2: item.seizureCost
            });
        });

        results[7][0].forEach(item => {
            allData.push({
                date: item.sell_date,
                description: 'ขายทรัพย์',
                a: item.sellamount,
                d: item.sellamount
            });
        });

        results[8][0].forEach(item => {
            allData.push({
                date: item.expense_date,
                description: `เพิ่มค่าใช้จ่าย: ${item.details}`,
                b: item.expense_amount,
                d2: item.expense_amount
            });
        });

        results[9][0].forEach(item => {
            allData.push({
                date: item.record_date,
                description: `เพิ่มรายได้: ${item.details}`,
                a: item.income_amount,
                d: item.income_amount
            });
        });

        results[10][0].forEach(item => {
            allData.push({
                date: item.capital_date,
                description: `เพิ่มเงินทุน: ${item.details}`,
                d: item.capital_amount
            });
        });

        // เพิ่มข้อมูลลงในตารางและสร้างแผนภูมิ
        addToTable(allData);
    });
});





$(function() {
    $('#dateRange').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD'
        },
        autoUpdateInput: false,
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month')
    });

    $('#dateRange').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });

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
    var table = document.getElementById("accountingTable");
    var tr = table.getElementsByTagName("tr");

    var totalIncome = 0;
    var totalExpense = 0;
    var debtorMoney = 0;
    var cashMoney = 0;

    for (var i = 1; i < tr.length; i++) {
        var tdDate = tr[i].getElementsByTagName("td")[1];
        var tdIncome = tr[i].getElementsByTagName("td")[3];
        var tdExpense = tr[i].getElementsByTagName("td")[4];
        var tdDebtor = tr[i].getElementsByTagName("td")[5];
        var tdCash = tr[i].getElementsByTagName("td")[6];

        if (tdDate) {
            var txtValue = tdDate.textContent || tdDate.innerText;
            var cellDate = moment(txtValue, 'YYYY-MM-DD');
            if (cellDate.isBetween(startDate, endDate, null, '[]')) {
                tr[i].style.display = "";
                totalIncome += parseFloat(tdIncome.textContent || tdIncome.innerText) || 0;
                totalExpense += parseFloat(tdExpense.textContent || tdExpense.innerText) || 0;
                debtorMoney += parseFloat(tdDebtor.textContent || tdDebtor.innerText) || 0;
                cashMoney += parseFloat(tdCash.textContent || tdCash.innerText) || 0;
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    var netProfit = totalIncome - totalExpense;
    createChart(totalIncome, totalExpense, netProfit, debtorMoney, cashMoney);
}