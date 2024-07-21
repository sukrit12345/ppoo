async function fetchNotificationCount() {
    try {
        const response = await fetch('/api/notifications/count'); // URL ของ API ที่ดึงจำนวนแจ้งเตือน
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        updateNotificationCount(data.count);
    } catch (error) {
        console.error('Error fetching notification count:', error);
    }
}

function updateNotificationCount(count) {
    const notificationLink = document.querySelector('a[href="เเจ้งเตือน.html"]');
    if (notificationLink) {
        notificationLink.setAttribute('data-count', count); // ใช้ data-count แทนการแก้ไข innerText
    }
}

// เรียกใช้งานฟังก์ชันเพื่อดึงข้อมูลเมื่อหน้าโหลด
fetchNotificationCount();


