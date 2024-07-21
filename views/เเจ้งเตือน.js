async function fetchLoanData() {
    try {
        const response = await fetch('/api/loans/completed');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data fetched:', data); // ตรวจสอบข้อมูลที่ได้รับ

        // เรียงลำดับข้อมูลตาม 'totalRefund' จากมากไปน้อย
        data.sort((a, b) => parseFloat(b.totalRefund) - parseFloat(a.totalRefund));

        populateTable(data);
        updateNotificationCount(data.length); // เพิ่มการเรียกใช้เพื่ออัพเดตจำนวน
    } catch (error) {
        console.error('Error fetching loan data:', error);
    }
}

function populateTable(data) {
    const tbody = document.getElementById('loanTableBody');
    tbody.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 10; // จำนวนคอลัมน์ทั้งหมด
        cell.textContent = 'ไม่มีข้อมูล';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    data.forEach((item, index) => {
        const row = document.createElement('tr');

        const cells = [
            data.length - index, // แสดง index ที่เรียงจากมากไปน้อย
            item.loanDate || 'N/A',
            item.id_card_number || 'N/A',
            item.fname || 'N/A',
            item.lname || 'N/A',
            item.returnDate || 'N/A',
            item.principal || 'N/A',
            item.totalInterest4 || 'N/A',
            item.totalRefund || 'N/A',
            item.manager || 'N/A'
        ];

        cells.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

function updateNotificationCount(count) {
    const notificationLink = document.querySelector('a.active2');
    if (notificationLink) {
        notificationLink.setAttribute('data-count', count); // ใช้ data-count แทนการแก้ไข innerText
        // บันทึกค่าลงใน localStorage
        localStorage.setItem('notificationCount', count);
    }
}



// เรียกใช้งานฟังก์ชันเพื่อดึงข้อมูล
fetchLoanData();
