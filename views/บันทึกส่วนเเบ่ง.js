// ไอดีร้าน
document.addEventListener('DOMContentLoaded', async () => { // เพิ่ม async เพื่อเรียกใช้ฟังก์ชันแบบ asynchronous
    // ดึงค่า ID จาก localStorage
    const id = localStorage.getItem('id_shop');
    const shopName = localStorage.getItem('shop_name');
    const nickname = localStorage.getItem('nickname');

    // ใส่ค่า ID ลงในฟิลด์ input ที่มี id เป็น 'creditorId'
    if (id) {
        document.getElementById('creditorId').value = id;
    }

    const managerSelect = document.getElementById('receiver_name');

    if (nickname) {
        // สร้าง option ใหม่ที่มี value และข้อความตรงกับ nickname
        const option = document.createElement('option');
        option.value = nickname;
        option.textContent = nickname;
        option.selected = true; // ตั้งค่าให้ option นี้ถูกเลือกโดยอัตโนมัติ
        managerSelect.appendChild(option);

        // ปิดการเลือกถ้ามีค่า nickname
        managerSelect.disabled = true; // ไม่สามารถเปลี่ยนตัวเลือกอื่นได้

        // ตั้งค่าให้ hidden input เก็บค่า nickname
        document.getElementById('managerValue').value = nickname;
    }

    // แสดงค่า ID ในคอนโซลสำหรับการดีบัก
    console.log('ID:', id);
    console.log('Shop Name:', shopName);
    console.log('Creditor Value:', document.getElementById('creditorId').value); // ตรวจสอบค่าที่ตั้งใน input
    console.log('Manager Value:', nickname);

    // เรียกใช้ฟังก์ชันเช็คสิทธิ์
    await checkAdminAccess(nickname); // เรียกใช้ฟังก์ชันเช็คสิทธิ์โดยใช้ nickname
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
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const refundId = urlParams.get('refundId');
        const manager = urlParams.get('manager');
        const initial_profit = urlParams.get('initial_profit');

        if (!refundId) {
            throw new Error('ไม่พบค่าพารามิเตอร์ refundId ใน URL');
        }

        const response = await fetch(`/api/refunddd/${refundId}`);
        if (!response.ok) {
            throw new Error('ไม่สามารถดึงข้อมูลได้');
        }

        const refundData = await response.json();

        // ตรวจสอบและแสดงข้อมูลลงในฟอร์ม
        if (refundData) {
            document.getElementById('manager').value = refundData.receiver_name || ''; 
            document.getElementById('initial_profit').value = initial_profit || '';
            document.getElementById('id_card_number').value = refundData.id_card_number || '';
            document.getElementById('fname').value = refundData.fname || '';
            document.getElementById('lname').value = refundData.lname || '';
            document.getElementById('contract_number').value = refundData.contract_number || '';
            document.getElementById('bill_number').value = refundData.bill_number || '';
            document.getElementById('manager_name').value = manager || ''; 
            document.getElementById('refundId').value = refundId;
        } else {
            console.error('ข้อมูลที่ดึงมาไม่ถูกต้องหรือไม่ครบถ้วน');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error.message);
    }
});






//วันที่ปัจจุบัน
function setDate() {
    var today = new Date();
    var month = (today.getMonth() + 1).toString().padStart(2, '0');
    var day = today.getDate().toString().padStart(2, '0');
    var dateStr = today.getFullYear() + '-' + month + '-' + day;    
    // ตั้งค่าที่ช่องป้อนข้อมูล
    document.getElementById('return_date_input').value = dateStr;
}

// เรียกใช้ฟังก์ชัน setDate เมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', (event) => {
    setDate();
});




// ฟังก์ชันคำนวณส่วนที่ต้องแบ่ง
function calculateShares() {
    // ดึงค่าจากอินพุต
    const initialProfit = parseFloat(document.getElementById('initial_profit').value) || 0; // กำไรเริ่มต้น
    const collectorSharePercent = parseFloat(document.getElementById('collector_share_percent').value) || 0; // เปอร์เซ็นต์ส่วนแบ่งของผู้เก็บ
    const managerSharePercent = parseFloat(document.getElementById('manager_share2').value) || 0; // เปอร์เซ็นต์ส่วนแบ่งของผู้จัดการ
    const receiverSharePercent = parseFloat(document.getElementById('receiver_share_percent').value) || 0; // เปอร์เซ็นต์ส่วนแบ่งของผู้รับ

    // ดึงค่าของส่วนแบ่งที่ป้อนตรงๆ
    const collectorShareInput = parseFloat(document.getElementById('collector_share').value) || 0; // ส่วนแบ่งของผู้เก็บที่ป้อนตรงๆ
    const managerShareInput = parseFloat(document.getElementById('manager_share').value) || 0; // ส่วนแบ่งของผู้จัดการที่ป้อนตรงๆ
    const receiverShareInput = parseFloat(document.getElementById('receiver_share').value) || 0; // ส่วนแบ่งของผู้รับที่ป้อนตรงๆ

    // คำนวณส่วนแบ่งของผู้เก็บหากไม่ได้ป้อนตรงๆ
    let collectorShare;
    if (collectorShareInput > 0) {
        collectorShare = collectorShareInput; // ใช้ค่าที่ป้อนตรงๆ
    } else {
        collectorShare = (initialProfit * collectorSharePercent) / 100; // คำนวณจากเปอร์เซ็นต์
    }

    const initialProfit2 = initialProfit - collectorShare; // กำไรหลังจากหักส่วนแบ่งของผู้เก็บ

    // คำนวณส่วนแบ่งของผู้จัดการหากไม่ได้ป้อนตรงๆ
    let managerShare;
    if (managerShareInput > 0) {
        managerShare = managerShareInput; // ใช้ค่าที่ป้อนตรงๆ
    } else {
        managerShare = (initialProfit2 * managerSharePercent) / 100; // คำนวณจากเปอร์เซ็นต์
    }

    // คำนวณกำไรและส่วนแบ่งของผู้รับหากไม่ได้ป้อนตรงๆ
    const receiverProfit = initialProfit2 - managerShare; // กำไรหลังจากหักส่วนแบ่งของผู้จัดการ
    let receiverShare;
    if (receiverShareInput > 0) {
        receiverShare = receiverShareInput; // ใช้ค่าที่ป้อนตรงๆ
    } else {
        receiverShare = (receiverProfit * receiverSharePercent) / 100; // คำนวณจากเปอร์เซ็นต์
    }

    // คำนวณรวมส่วนแบ่งและกำไรสุทธิ
    const totalShare = collectorShare + managerShare + receiverShare; // รวมส่วนแบ่งทั้งหมด
    const netProfit = initialProfit - totalShare; // กำไรสุทธิ

    // ตั้งค่าที่คำนวณได้
    document.getElementById('collector_share').value = collectorShare.toFixed(0); // ส่วนแบ่งของผู้เก็บ
    document.getElementById('initial_profit2').value = initialProfit2.toFixed(0); // กำไรหลังจากหักส่วนแบ่งของผู้เก็บ
    document.getElementById('manager_share').value = managerShare.toFixed(0); // ส่วนแบ่งของผู้จัดการ
    document.getElementById('receiver_profit').value = receiverProfit.toFixed(0); // กำไรหลังจากหักส่วนแบ่งของผู้จัดการ
    document.getElementById('receiver_share').value = receiverShare.toFixed(0); // ส่วนแบ่งของผู้รับ
    document.getElementById('total_share').value = totalShare.toFixed(0); // รวมส่วนแบ่งทั้งหมด
    document.getElementById('net_profit').value = netProfit.toFixed(0); // กำไรสุทธิ
}

// เรียกใช้ฟังก์ชัน calculateShares() ครั้งแรกและเมื่อมีการเปลี่ยนแปลงข้อมูล
document.addEventListener('DOMContentLoaded', () => {
    calculateShares(); // การคำนวณเริ่มต้น

    // เพิ่มเหตุการณ์การเปลี่ยนแปลงสำหรับเปอร์เซ็นต์ส่วนแบ่ง
    document.getElementById('initial_profit').addEventListener('input', calculateShares);
    document.getElementById('collector_share_percent').addEventListener('input', calculateShares);
    document.getElementById('manager_share2').addEventListener('input', calculateShares);
    document.getElementById('receiver_share_percent').addEventListener('input', calculateShares);
    
    // เพิ่มเหตุการณ์การเปลี่ยนแปลงสำหรับส่วนแบ่งที่ป้อนตรงๆ
    document.getElementById('collector_share').addEventListener('input', calculateShares);
    document.getElementById('manager_share').addEventListener('input', calculateShares);
    document.getElementById('receiver_share').addEventListener('input', calculateShares);
});










//เลือกชื่อเเอดมินรับเงิน
document.addEventListener('DOMContentLoaded', function() {
    const creditorId = localStorage.getItem('id_shop'); // ดึง creditorId จาก localStorage

    if (!creditorId) {
        console.error('creditorId is not defined');
        return;
    }

    fetch(`/api/receiver_name?creditorId=${creditorId}`) // ส่ง creditorId ไปยัง API
      .then(response => response.json())
      .then(data => {
        const receiver_nameSelect = document.getElementById('receiver_name');
        data.forEach(receiver_name => {
          const option = document.createElement('option');
          option.value = receiver_name.nickname;
          option.textContent = receiver_name.nickname;
          receiver_nameSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error:', error));
});









//เเสดงไฟล์ภาพที่กำลังบันทึก
function handleFileSelect(event) {
    const input = event.target;
    const file = input.files[0];
    const preview = document.getElementById(input.id + '_preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // แสดงภาพ
        };
        reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
    } else {
        preview.src = '';
        preview.style.display = 'none'; // ซ่อนภาพ
    }
}

// เพิ่ม event listeners ให้กับ input file
document.getElementById('receiver_receipt_photo').addEventListener('change', handleFileSelect);
document.getElementById('manager_receipt_photo').addEventListener('change', handleFileSelect);
document.getElementById('collector_receipt_photo').addEventListener('change', handleFileSelect);






//เเสดงข้อมูลส่วนเเบ่งตามid
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('_id'); // เปลี่ยนเป็น _id

    if (id) {
        try {
            const response = await fetch(`/api/profitsharingss/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const profitSharing = await response.json();

            // เติมข้อมูลในฟอร์ม
            document.getElementById('manager').value = profitSharing.manager || '';
            document.getElementById('id_card_number').value = profitSharing.id_card_number || '';
            document.getElementById('fname').value = profitSharing.fname || '';
            document.getElementById('lname').value = profitSharing.lname || '';
            document.getElementById('contract_number').value = profitSharing.contract_number || '';
            document.getElementById('bill_number').value = profitSharing.bill_number || '';

            // ข้อมูลการแบ่งเงินคนทวง
            document.getElementById('return_date_input').value = profitSharing.returnDate;
            document.getElementById('initial_profit').value = profitSharing.initialProfit || '';
            document.getElementById('collector_name').value = profitSharing.collectorName || '';
            document.getElementById('collector_share_percent').value = profitSharing.collectorSharePercent || '';
            document.getElementById('collector_share').value = profitSharing.collectorShare || '';

            // แสดงภาพถ่ายสลิปคนทวงถ้ามี
            const collectorReceiptPreview = document.getElementById('collector_receipt_photo_preview');
            if (profitSharing.collectorReceiptPhoto && profitSharing.collectorReceiptPhoto.length > 0) {
                const file = profitSharing.collectorReceiptPhoto[0];
                const imageUrl = `data:${file.mimetype};base64,${file.data}`;
                collectorReceiptPreview.style.display = 'block';
                collectorReceiptPreview.src = imageUrl;
            } else {
                collectorReceiptPreview.style.display = 'none';
            }

            // ข้อมูลการแบ่งเงินแอดมินดูแล
            document.getElementById('initial_profit2').value = profitSharing.initialProfit2 || '';
            document.getElementById('manager_name').value = profitSharing.managerName || '';
            document.getElementById('manager_share2').value = profitSharing.managerSharePercent || '';
            document.getElementById('manager_share').value = profitSharing.managerShare || '';

            // แสดงภาพถ่ายสลิปแอดมินดูแลถ้ามี
            const managerReceiptPreview = document.getElementById('manager_receipt_photo_preview');
            if (profitSharing.managerReceiptPhoto && profitSharing.managerReceiptPhoto.length > 0) {
                const file = profitSharing.managerReceiptPhoto[0];
                const imageUrl = `data:${file.mimetype};base64,${file.data}`;
                managerReceiptPreview.style.display = 'block';
                managerReceiptPreview.src = imageUrl;
            } else {
                managerReceiptPreview.style.display = 'none';
            }

            // ข้อมูลการแบ่งเงินแอดมินรับเงิน
            document.getElementById('receiver_profit').value = profitSharing.receiverProfit || '';
            document.getElementById('receiver_name').value = profitSharing.receiverName || '';
            document.getElementById('receiver_share_percent').value = profitSharing.receiverSharePercent || '';
            document.getElementById('receiver_share').value = profitSharing.receiverShare || '';

            // แสดงภาพถ่ายสลิปแอดมินรับเงินถ้ามี
            const receiverReceiptPreview = document.getElementById('receiver_receipt_photo_preview');
            if (profitSharing.receiverReceiptPhoto && profitSharing.receiverReceiptPhoto.length > 0) {
                const file = profitSharing.receiverReceiptPhoto[0];
                const imageUrl = `data:${file.mimetype};base64,${file.data}`;
                receiverReceiptPreview.style.display = 'block';
                receiverReceiptPreview.src = imageUrl;
            } else {
                receiverReceiptPreview.style.display = 'none';
            }

            // ข้อมูลกำไรสุทธิ
            document.getElementById('total_share').value = profitSharing.totalShare || '';
            document.getElementById('net_profit').value = profitSharing.netProfit || '';

            // ซ่อนฟิลด์ไฟล์และทำให้ไม่สามารถเลือกไฟล์ได้
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.disabled = true; // ทำให้ฟิลด์ไฟล์ไม่สามารถเลือกไฟล์ได้
                input.style.display = 'none'; // ซ่อนฟิลด์ไฟล์
            });

            // ทำให้ฟิลด์ทั้งหมดเป็น readonly
            document.querySelectorAll('input, select').forEach(element => {
                if (element.tagName.toLowerCase() === 'select') {
                    element.setAttribute('disabled', 'disabled');
                } else {
                    element.setAttribute('readonly', 'readonly');
                }
            });

            // ปิดการทำงานของปุ่มบันทึก
            document.querySelector('input[type="submit"]').setAttribute('disabled', 'disabled');

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        }
    }
});




