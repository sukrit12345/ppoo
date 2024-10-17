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




document.addEventListener('DOMContentLoaded', async () => {
    const creditorId = localStorage.getItem('id_shop'); // ดึง ID จาก localStorage

    if (creditorId) {
        try {
            const [debtors, loans, refunds, profitSharings, managers, seizures, sales, iCloudRecords, incomes, expenses, capitals] = await Promise.all([
                fetchDebtors(creditorId),
                fetchLoans(creditorId),
                fetchRefund(creditorId),
                fetchProfitSharings(creditorId),
                fetchManagers(creditorId),
                fetchSeizures(creditorId),
                fetchSales(creditorId),
                fetchiCloudRecords(creditorId),
                fetchIncomes(creditorId),
                fetchExpenses(creditorId),
                fetchCapitals(creditorId)
            ]);

            // เรียกใช้ฟังก์ชัน displayCombinedData เพื่อแสดงข้อมูลในตารางเดียว
            displayCombinedData(debtors, loans, refunds, profitSharings, managers, seizures, sales, iCloudRecords, incomes, expenses, capitals);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.error('No creditor ID found in localStorage');
    }
});

// ฟังก์ชันดึงข้อมูลจาก API แต่ละอัน
async function fetchDebtors(creditorId) {
    const response = await fetch(`/api/debtors-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch debtors');
    return await response.json();
}

async function fetchLoans(creditorId) {
    const response = await fetch(`/api/loans-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch loans');
    return await response.json();
}

async function fetchRefund(creditorId) {
    const response = await fetch(`/api/refund-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch refunds');
    return await response.json();
}

async function fetchProfitSharings(creditorId) {
    const response = await fetch(`/api/profit-sharing-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch profit sharings');
    return await response.json();
}

async function fetchManagers(creditorId) {
    const response = await fetch(`/api/manager-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch managers');
    return await response.json();
}

async function fetchSeizures(creditorId) {
    const response = await fetch(`/api/seizure-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch seizures');
    return await response.json();
}

async function fetchSales(creditorId) {
    const response = await fetch(`/api/sale-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch sales');
    return await response.json();
}

async function fetchiCloudRecords(creditorId) {
    const response = await fetch(`/api/icloud-record-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch iCloud records');
    return await response.json();
}

async function fetchIncomes(creditorId) {
    const response = await fetch(`/api/income-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch incomes');
    return await response.json();
}

async function fetchExpenses(creditorId) {
    const response = await fetch(`/api/expense-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return await response.json();
}

async function fetchCapitals(creditorId) {
    const response = await fetch(`/api/capital-history/${creditorId}`);
    if (!response.ok) throw new Error('Failed to fetch capitals');
    return await response.json();
}

// ฟังก์ชันเพื่อแสดงข้อมูลในตาราง
function displayCombinedData(debtors, loans, refunds, profitSharings, managers, seizures, sales, iCloudRecords, incomes, expenses, capitals) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // ล้างข้อมูลเก่า

    // สร้างอาร์เรย์สำหรับข้อมูลทั้งหมด
    const allData = [
        ...debtors.map(debtor => ({
            date: debtor.date,
            manager: debtor.manager,
            type: 'บันทึก',
            description: 'ข้อมูลส่วนตัวลูกหนี้',
            id_card_number: debtor.id_card_number,
            contract_number: '-',
            bill_number: '-',
            amount: '-'
        })),
        ...loans.map(loan => ({
            date: loan.loanDate,
            manager: loan.manager,
            type: 'บันทึก',
            description: 'ข้อมูลสัญญา',
            id_card_number: loan.id_card_number,
            contract_number: loan.contract_number,
            bill_number: loan.bill_number,
            amount: '-'
        })),
        ...refunds.map(refund => ({
            date: refund.return_date,
            manager: refund.manager,
            type: 'บันทึก',
            description: 'ข้อมูลการคืนเงิน',
            id_card_number: refund.id_card_number,
            contract_number: refund.contract_number,
            bill_number: refund.bill_number,
            amount: '-'
        })),
        ...profitSharings.map(profitSharing => ({
            date: profitSharing.returnDate,
            manager: profitSharing.manager,
            type: 'บันทึก',
            description: 'ข้อมูลส่วนแบ่ง',
            id_card_number: profitSharing.id_card_number,
            contract_number: profitSharing.contract_number,
            bill_number: profitSharing.bill_number,
            amount: '-'
        })),
        ...managers.map(manager => ({
            date: manager.record_date,
            manager: manager.nickname,
            type: 'บันทึก',
            description: 'ข้อมูลเเอดมิน',
            id_card_number: manager.id_card_number,
            contract_number: '-',
            bill_number: '-',
            amount: '-'
        })),
        ...seizures.map(seizure => ({
            date: seizure.seizure_date,
            manager: seizure.manager,
            type: 'บันทึก',
            description: 'ข้อมูลการยึดทรัพย์',
            id_card_number: seizure.id_card_number,
            contract_number: seizure.contract_number,
            bill_number: seizure.bill_number,
            amount: '-'
        })),
        ...sales.map(sale => ({
            date: sale.sale_date,
            manager: sale.manager,
            type: 'บันทึก',
            description: 'ข้อมูลการขายทรัพย์สิน',
            id_card_number: sale.id_card_number,
            contract_number: sale.contract_number,
            bill_number: sale.bill_number,
            amount: '-'
        })),
        ...iCloudRecords.map(iCloudRecord => ({
            date: iCloudRecord.record_date,
            manager: iCloudRecord.admin,
            type: 'บันทึก',
            description: 'ข้อมูลไอคราว',
            id_card_number: '-',
            contract_number: '-',
            bill_number: '-',
            amount: iCloudRecord.user_email
        })),
        ...incomes.map(income => ({
            date: income.record_date,
            manager: income.admin,
            type: 'บันทึก',
            description: 'ข้อมูลรายได้',
            id_card_number: '-',
            contract_number: '-',
            bill_number: '-',
            amount: '-'
        })),
        ...expenses.map(expense => ({
            date: expense.expense_date,
            manager: expense.admin,
            type: 'บันทึก',
            description: 'ข้อมูลค่าใช้จ่าย',
            id_card_number: '-',
            contract_number: '-',
            bill_number: '-',
            amount: '-'
        })),
        ...capitals.map(capital => ({
            date: capital.capital_date,
            manager: capital.admin,
            type: 'บันทึก',
            description: 'ข้อมูลเงินทุน',
            id_card_number: '-',
            contract_number: '-',
            bill_number: '-',
            amount: '-'
        }))
    ];

    // เรียงลำดับข้อมูลตามวันที่หรือตามลำดับที่คุณต้องการ
    allData.sort((a, b) => new Date(b.date) - new Date(a.date));
    // วนลูปข้อมูลทั้งหมดและเพิ่มไปในตาราง
    const totalRows = allData.length; // จำนวนแถวทั้งหมด
    allData.forEach((data, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${totalRows - index}</td> <!-- ปรับที่นี่ -->
          <td>${data.date}</td>
          <td>${data.manager}</td>
          <td>${data.type}</td>
          <td>${data.description}</td>
          <td>${data.id_card_number}</td>
          <td>${data.contract_number}</td>
          <td>${data.bill_number}</td>
          <td>${data.amount}</td>
      `;
      tableBody.appendChild(row);
    });


}
