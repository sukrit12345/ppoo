//รับข้อมูล เลขบปชช ชื่อ นามสกุล
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);

    // ดึงค่า id_card_number และแสดงใน HTML
    const idCardNumber = urlParams.get('id_card_number');
    document.getElementById('id-card-number').textContent = idCardNumber ? idCardNumber : "N/A";

    // ดึงค่า fname และแสดงใน HTML
    const firstName = urlParams.get('fname');
    document.getElementById('first-name').textContent = firstName ? firstName : "N/A";

    // ดึงค่า lname และแสดงใน HTML
    const lastName = urlParams.get('lname');
    document.getElementById('last-name').textContent = lastName ? lastName : "N/A";

    // ดึงค่า manager และแสดงใน HTML
    const manager = urlParams.get('manager');
    document.getElementById('manager').textContent = manager ? manager : "N/A";
});

//ส่งเลขบปชช ชื่อ นามสกุลไปหน้าบันทึกสัญญา
function redirectToContractPage() {
    // ดึงค่า id_card_number, fname, และ lname จาก URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const fname = urlParams.get('fname');
    const lname = urlParams.get('lname');
    const manager = urlParams.get('manager');


    if (idCardNumber && fname && lname && manager ) {
        // สร้าง URL ใหม่เพื่อไปยังหน้า "บันทึกสัญญา.html" โดยเพิ่มเฉพาะค่า id_card_number, fname, และ lname
        const newURL = `/บันทึกสัญญา.html?id_card_number=${encodeURIComponent(idCardNumber)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&manager=${encodeURIComponent(manager)}`;
        // นำ URL ใหม่ไปที่หน้าที่ต้องการ
        window.location.href = newURL;
    } else {
        console.error('ส่งไม่สำเร็จ');
    }
}

//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มสัญญา
function redirectToContractPage2() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/สัญญา.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}



//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มคืนเงิน
function redirectToContractPage3() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/คืนเงิน.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}



//เเสดงข้อมูลเลขบปชช ชื่อ นามสกุล เมื่อกดปุ่มคืนเงิน
function redirectToContractPage4() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');
    const firstName = urlParams.get('fname');
    const lastName = urlParams.get('lname');
    const manager = urlParams.get('manager');

    // สร้าง URL ใหม่เพื่อไปยังหน้า "สัญญา.html" พร้อมกับส่งค่า id_card_number, fname, และ lname ไปด้วย
    const newURL = '/ส่วนเเบ่ง.html?id_card_number=' + encodeURIComponent(idCardNumber) +
                   '&fname=' + encodeURIComponent(firstName) +
                   '&lname=' + encodeURIComponent(lastName)+
                   '&manager=' + encodeURIComponent(manager);
    
    // นำ URL ใหม่ไปที่หน้าที่ต้องการ
    window.location.href = newURL;
}




document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCardNumber = urlParams.get('id_card_number');

    // Fetch API เพื่อดึงข้อมูล LoanInformation ตาม id_card_number
    fetch(`/api/loan-data?id_card_number=${idCardNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching loan data');
            }
            return response.json();
        })
        .then(loans => {
            // เมื่อได้ข้อมูล loans มาแล้ว จะทำการดึงข้อมูล refunds ต่อ
            return fetch(`/api/refunds/${idCardNumber}`).then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching refund data');
                }
                return response.json();
            }).then(refunds => {
                const table = document.getElementById('b');
                refunds.reverse().forEach(refund => {
                    // สร้างแถวใหม่
                    const tr = document.createElement('tr');

                    // ตรวจสอบว่ามีข้อมูลใน LoanInformation ที่ตรงกับ refunds หรือไม่
                    const matchedLoan = loans.find(loan => 
                        loan.id_card_number === refund.id_card_number && 
                        loan.contract_number === refund.contract_number && 
                        loan.bill_number === refund.bill_number
                    );

                    // กำหนดค่าให้กับ totalReturned จาก LoanInformation หากพบข้อมูลที่ตรงกัน
                    const totalReturned = matchedLoan ? matchedLoan.totalReturned : '-';
                    const principal = matchedLoan ? matchedLoan.principal : '-';
                    const totalInterest4 = matchedLoan ? matchedLoan.totalInterest4 : '-';

                    // คำนวณ totalInterest5 และ initial_profit โดยดึงจาก API
                    fetch(`/api/calculate_interest_profit/${refund._id}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error calculating interest and profit');
                            }
                            return response.json();
                        })
                        .then(calculatedValues => {
                            const { totalInterest5, initial_profit } = calculatedValues;

                            // เช็คเงื่อนไขว่า total_refund ไม่เท่ากับ totalReturned
                            if (totalReturned !== '-' && refund.total_refund < totalReturned) {
                                // บันทึกข้อมูลสัญญาใหม่อัตโนมัติ
                                const newLoanData = {
                                    manager: refund.manager,
                                    id_card_number: refund.id_card_number,
                                    fname: refund.fname,
                                    lname: refund.lname,
                                    contract_number: refund.contract_number,
                                    bill_number: (parseInt(refund.bill_number) + 1).toString(),
                                    loanDate: new Date().toISOString().split('T')[0], // วันที่ปัจจุบัน
                                    loanPeriod: matchedLoan.loanPeriod,
                                    returnDate: matchedLoan.returnDate,
                                    principal: matchedLoan.principal,
                                    interestRate: matchedLoan.interestRate,
                                    totalInterest: matchedLoan.principal * matchedLoan.interestRate, // คำนวณ totalInterest ใหม่
                                    totalInterest2: matchedLoan.totalInterest2 || 0,
                                    totalInterest3: totalInterest5,
                                    totalInterest4: matchedLoan.totalInterest4,
                                    totalRefund: matchedLoan.totalRefund,
                                    status: matchedLoan.status,
                                    storeAssets: matchedLoan.storeAssets,
                                    icloudAssets: matchedLoan.icloudAssets,
                                    assetReceiptPhoto: matchedLoan.assetReceiptPhoto,
                                    icloudAssetPhoto: matchedLoan.icloudAssetPhoto,
                                    refundReceiptPhoto: matchedLoan.refundReceiptPhoto,
                                    contract: matchedLoan.contract,
                                    debtor: matchedLoan.debtor
                                };

                                // เรียก API เพื่อบันทึกข้อมูลสัญญาใหม่
                                fetch('/api/add-loan', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(newLoanData)
                                }).then(response => {
                                    if (!response.ok) {
                                        throw new Error('Error saving new loan information');
                                    }
                                    return response.json();
                                }).then(data => {
                                    console.log('New loan information saved:', data);
                                }).catch(error => {
                                    console.error('Error saving new loan information:', error);
                                });
                            }

                            tr.innerHTML = `
                                <td>${refund.contract_number}</td>
                                <td>${refund.bill_number}</td>
                                <td>${principal}</td>
                                <td>${totalInterest4}</td>
                                <td>${totalReturned}</td>
                                <td>${refund.return_date}</td>
                                <td>${refund.refund_principal}</td>
                                <td>${refund.refund_interest}</td>
                                <td>-</td>
                                <td>${refund.total_refund}</td>
                                <td>${totalInterest5}</td>
                                <td>${initial_profit}</td>
                                <td>-</td>
                                <td>${refund.status}</td>
                                <td>
                                    <button onclick="redirectToEdit('${refund._id}')">แก้ไข</button>
                                    <button onclick="redirectToDelete('${refund._id}')">ลบ</button>
                                </td>
                                <td><button onclick="handleShare('${refund._id}', '${refund.id_card_number}', '${refund.fname}', '${refund.lname}', '${refund.manager}', '${refund.contract_number}', '${refund.bill_number}')">ส่วนแบ่ง</button></td>
                            `;

                            // เพิ่มแถวใหม่ลงในตาราง
                            table.appendChild(tr);
                        })
                        .catch(error => {
                            console.error('Error calculating interest and profit:', error);
                        });
                });
            }).catch(error => {
                console.error('Error fetching refunds:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching loans:', error);
        });
});







function redirectToEdit(refundId) {
    // เปลี่ยนเส้นทางไปยังหน้าแก้ไขพร้อมพารามิเตอร์ refundId
    const url = `/edit.html?refundId=${refundId}`;
    window.location.href = url;
}

function redirectToDelete(refundId) {
    // เปลี่ยนเส้นทางไปยังหน้าลบพร้อมพารามิเตอร์ refundId
    const url = `/delete.html?refundId=${refundId}`;
    window.location.href = url;
}






function handleShare(loanId, idCardNumber, fname, lname, manager, contractNumber, billNumber) {
    // ตัวอย่างการดำเนินการ: เปลี่ยนเส้นทางไปยังหน้าส่วนแบ่งพร้อมพารามิเตอร์
    const url = `/บันทึกส่วนเเบ่ง.html?loanId=${loanId}&id_card_number=${idCardNumber}&fname=${fname}&lname=${lname}&manager=${manager}&contract_number=${contractNumber}&bill_number=${billNumber}`;
    window.location.href = url;
}















