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


document.addEventListener("DOMContentLoaded", function () {
    // เมื่อ DOM โหลดเสร็จสมบูรณ์
    var urlParams = new URLSearchParams(window.location.search);

    // ดึงค่าตามชื่อพารามิเตอร์ที่ต้องการ
    var manager = urlParams.get('manager');
    var idCardNumber = urlParams.get('id_card_number');
    var fname = urlParams.get('fname');
    var lname = urlParams.get('lname');
    var contractNumber = urlParams.get('contract_number');
    var billNumber = urlParams.get('bill_number');
    var principal = urlParams.get('principal');
    var loanId = urlParams.get('loan_id'); // ดึงค่า loan_id


    // กำหนดค่าที่ดึงได้ในฟอร์ม
    if (manager) document.getElementById("manager").value = manager;
    if (idCardNumber) document.getElementById("id_card_number").value = idCardNumber;
    if (fname) document.getElementById("fname").value = fname;
    if (lname) document.getElementById("lname").value = lname;
    if (contractNumber) document.getElementById("contract_number").value = contractNumber;
    if (billNumber) document.getElementById("bill_number").value = billNumber;
    if (principal) document.getElementById("principal").value = principal;
    
    // กำหนดค่า loan_id ให้กับ input element "loan"
    document.getElementById('loan').value = loanId || '';

    // กำหนดค่าวันที่ให้กับ input element "seizureDate"
    setReturnDateInput();
});



// เรียกฟังก์ชัน setReturnDateInput เมื่อหน้าเว็บโหลด
function setReturnDateInput() {
    // สร้างวันที่ปัจจุบัน
    var today = new Date();

    // หากเดือนหรือวันเป็นเลขเดียว ให้เพิ่ม "0" ข้างหน้า
    var month = (today.getMonth() + 1 < 10) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();

    // กำหนดค่าวันที่ให้กับ input element "seizureDate"
    document.getElementById('seizureDate').value = today.getFullYear() + '-' + month + '-' + day;
}

// คำนวณค่ารวมต้นทุนทรัพย์เมื่อมีการเปลี่ยนแปลงใน principal หรือ seizureCost
document.getElementById('principal').addEventListener('input', calculateTotalProperty);
document.getElementById('seizureCost').addEventListener('input', calculateTotalProperty);

function calculateTotalProperty() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const seizureCost = parseFloat(document.getElementById('seizureCost').value) || 0;
    const totalProperty = Math.round(principal + seizureCost); // ให้เปลี่ยนจาก toFixed(0) เป็น Math.round() เพื่อให้ได้ผลลัพธ์เป็นจำนวนเต็ม
    document.getElementById('totalproperty').value = totalProperty; // ปรับการกำหนดค่าที่นี่
}











  



//เลือกชื่อเเอดมินยึดทรัพย์
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
document.getElementById('assetPhoto').addEventListener('change', handleFileSelect);
document.getElementById('seizureCost2').addEventListener('change', handleFileSelect);



document.getElementById('seizureForm').addEventListener('submit', function(event) {
    // อัปเดตข้อมูล Base64 ของไฟล์
    const assetPhoto = document.getElementById('assetPhoto').files[0];
    const seizureCost2 = document.getElementById('seizureCost2').files[0];

    if (assetPhoto) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('assetPhotoBase64').value = e.target.result;
        };
        reader.readAsDataURL(assetPhoto);
    }

    if (seizureCost2) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('seizureCost2Base64').value = e.target.result;
        };
        reader.readAsDataURL(seizureCost2);
    }
});









// ประเภทและชื่อทรัพย์ที่ยึด
const assetOptions = {
  "อสังหาริมทรัพย์": ["บ้าน", "คอนโด", "ที่ดิน"],
  "รถยนต์": ["รถยนต์", "จักรยานยนต์", "รถบรรทุก"],
  "เครื่องใช้ไฟฟ้า": ["ตู้เย็น", "ทีวี", "เครื่องซักผ้า"]
};

// ฟังก์ชันสำหรับการบันทึกตัวเลือกใน Local Storage
function saveOptionsToStorage() {
  const id = localStorage.getItem('id_shop'); // ดึง ID ของร้านค้า
  const storedOptionsKey = `assetOptions_${id}`; // สร้างคีย์สำหรับร้านค้านั้น ๆ
  localStorage.setItem(storedOptionsKey, JSON.stringify(assetOptions));
}

// ฟังก์ชันสำหรับการอัปเดตตัวเลือกชื่อทรัพย์
function updateAssetNameOptions() {
  const seizedAssetType = document.getElementById("seizedAssetType").value;
  const assetNameSelect = document.getElementById("assetName");

  // ล้างตัวเลือกปัจจุบัน
  assetNameSelect.innerHTML = '<option value="">เลือกชื่อทรัพย์ที่ยึด</option>';

  if (seizedAssetType && assetOptions[seizedAssetType]) {
    assetOptions[seizedAssetType].forEach(option => {
      const newOption = document.createElement("option");
      newOption.value = option;
      newOption.text = option;
      assetNameSelect.add(newOption);
    });
  }
}

// เพิ่มตัวเลือกใหม่
function addOption(selectId) {
  const selectElement = document.getElementById(selectId);
  const newOption = prompt("กรอกตัวเลือกใหม่:");

  if (newOption) {
    const option = document.createElement("option");
    option.value = newOption;
    option.text = newOption;

    if (selectId === "seizedAssetType") {
      selectElement.add(option);
      assetOptions[newOption] = []; // สร้างตัวเลือกสำหรับประเภทใหม่
    } else {
      const selectedType = document.getElementById("seizedAssetType").value;
      if (selectedType) {
        selectElement.add(option);
        assetOptions[selectedType].push(newOption);
      } else {
        alert("กรุณาเลือกประเภททรัพย์ที่ยึดก่อนเพิ่มชื่อทรัพย์");
        return;
      }
    }

    saveOptionsToStorage(); // บันทึกตัวเลือกใหม่
    updateAssetNameOptions(); // อัปเดตตัวเลือกชื่อทรัพย์
  }
}

// ลบตัวเลือก
function removeOption(selectId) {
  const selectElement = document.getElementById(selectId);
  const selectedOption = selectElement.value;

  if (!selectedOption) {
    alert("กรุณาเลือกตัวเลือกที่จะลบ");
    return;
  }

  const confirmDeletion = confirm(`คุณต้องการลบ "${selectedOption}" ใช่หรือไม่?`);
  if (!confirmDeletion) {
    return;
  }

  if (selectId === "seizedAssetType") {
    delete assetOptions[selectedOption];
    selectElement.remove(selectElement.selectedIndex);
    updateAssetNameOptions();
  } else {
    const selectedType = document.getElementById("seizedAssetType").value;
    if (selectedType && assetOptions[selectedType]) {
      const index = assetOptions[selectedType].indexOf(selectedOption);
      if (index > -1) {
        assetOptions[selectedType].splice(index, 1);
        selectElement.remove(selectElement.selectedIndex);
      }
    }
  }

  saveOptionsToStorage(); // บันทึกการลบตัวเลือก
  updateAssetNameOptions(); // อัปเดตตัวเลือกชื่อทรัพย์
}

// ฟังก์ชันสำหรับการโหลดตัวเลือกจาก Local Storage
function loadOptionsFromStorage() {
  const id = localStorage.getItem('id_shop'); // ดึง ID ของร้านค้า
  const storedOptionsKey = `assetOptions_${id}`; // สร้างคีย์สำหรับร้านค้านั้น ๆ
  const storedOptions = JSON.parse(localStorage.getItem(storedOptionsKey)) || {}; // ถ้าไม่มีให้ใช้ object ว่าง

  // ลบตัวเลือกที่มีอยู่ในเซลล์ประเภททรัพย์ก่อน
  const seizedAssetTypeSelect = document.getElementById("seizedAssetType");
  seizedAssetTypeSelect.innerHTML = '<option value="">เลือกประเภททรัพย์</option>'; // รีเซ็ตตัวเลือก

  // อัปเดต assetOptions จากข้อมูลที่โหลด
  Object.keys(storedOptions).forEach(type => {
    assetOptions[type] = storedOptions[type]; // อัปเดต assetOptions

    const option = document.createElement("option");
    option.value = type;
    option.text = type;
    seizedAssetTypeSelect.add(option); // เพิ่มตัวเลือกใหม่
  });
}

// เรียกใช้ฟังก์ชันโหลดเมื่อเอกสารถูกโหลด
document.addEventListener('DOMContentLoaded', () => {
  loadOptionsFromStorage();
  updateAssetNameOptions(); // อัปเดตตัวเลือกชื่อทรัพย์เมื่อโหลด
});

// ฟังก์ชันเพื่อเปลี่ยน ID ของร้านค้า
function changeShopId(newId) {
  localStorage.setItem('id_shop', newId); // เปลี่ยน ID ของร้านค้าใน Local Storage
  loadOptionsFromStorage(); // โหลดตัวเลือกใหม่ตาม ID ใหม่
}
















// โหลดข้อมูลจาก URL และแสดงในฟอร์ม
document.addEventListener("DOMContentLoaded", async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const seizureId = urlParams.get('seizure_id');

  if (seizureId) {
    try {
      const response = await fetch(`/api/seize-assetss/${seizureId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const seizure = await response.json();

      document.getElementById('manager').value = seizure.manager || '';
      document.getElementById('id_card_number').value = seizure.id_card_number || '';
      document.getElementById('contract_number').value = seizure.contract_number || '';
      document.getElementById('fname').value = seizure.fname || '';
      document.getElementById('lname').value = seizure.lname || '';
      document.getElementById('bill_number').value = seizure.bill_number || '';
      document.getElementById('seizureDate').value = seizure.seizureDate || '';
      document.getElementById('receiver_name').value = seizure.receiver_name || '';
      document.getElementById('collector_name').value = seizure.collector_name || '';
      document.getElementById('principal').value = seizure.principal || '';
      document.getElementById('seizureCost').value = seizure.seizureCost || '';
      document.getElementById('totalproperty').value = seizure.totalproperty || '';

      if (seizure.seizedAssetType) {
        document.getElementById('seizedAssetType').value = seizure.seizedAssetType;
        updateAssetNameOptions();
      }

      if (seizure.assetName) {
        document.getElementById('assetName').value = seizure.assetName;
      }

      document.getElementById('assetDetails').value = seizure.assetDetails || '';

      const photoPreview = document.getElementById('assetPhoto_preview');
      if (seizure.assetPhoto && seizure.assetPhoto.length > 0) {
        photoPreview.src = seizure.assetPhoto[0].data;
        photoPreview.style.display = 'block';
      } else {
        photoPreview.style.display = 'none';
      }

      const costPreview = document.getElementById('seizureCost2_preview');
      if (seizure.seizureCost2 && seizure.seizureCost2.length > 0) {
        costPreview.src = seizure.seizureCost2[0].data;
        costPreview.style.display = 'block';
      } else {
        costPreview.style.display = 'none';
      }

      document.querySelectorAll('select').forEach(element => {
        element.setAttribute('disabled', 'disabled');
      });

      document.querySelectorAll('input, textarea').forEach(element => {
        element.setAttribute('readonly', 'readonly');
      });

      document.querySelectorAll('input[type="file"]').forEach(element => {
        element.setAttribute('disabled', 'disabled');
      });

      document.getElementById('save_button').setAttribute('disabled', 'disabled');

    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    }
  } else {
    console.error('Seizure ID is missing');
  }
});

// โหลดตัวเลือกเมื่อหน้าเว็บถูกโหลด
window.onload = function() {
  loadOptionsFromStorage();
  updateAssetNameOptions();
};





