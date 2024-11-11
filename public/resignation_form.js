const saveDraft = document.getElementById("save-draft");
const submit = document.getElementById("submit");
const cancel = document.getElementById("cancel");
const form = document.getElementById("resignationForm");

const userId = localStorage.getItem('userId');
let requestFormId = localStorage.getItem("requestFormId"); // Top-level scope


saveDraft.addEventListener("click", async () => {
    const draftForm = {
        status: "รอดำเนินการ",
        state: "Draft",
        type: "resign_course",
        details: {
            date: new Date().toLocaleDateString(),
            studentName: `${document.getElementById('title').value} ${document.getElementById('studentName').value} ${document.getElementById('studentLastName').value}`,
            studentId: document.getElementById('studentId').value,
            semester: document.getElementById('semester').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            subDistrict: document.getElementById('subDistrict').value,
            province: document.getElementById('province').value,
            contact: document.getElementById('contact').value,
            parentContactNumber: document.getElementById('parentContactNumber').value,
            advisor: document.getElementById('advisor').value,
            sinceSemester: document.getElementById('sinceSemester').value,
            semesterYear: `${document.getElementById('semesterYear').value}/${document.getElementById('semesterTerm').value}`,
            courseId: document.getElementById('courseId').value,
            courseName: document.getElementById('courseName').value,
            section: document.getElementById('section').value,
            requestReason: document.getElementById('requestReason').value
        }
    };

    if (!userId) {
        alert('กรุณาล็อกอินก่อน');
        return;
    }

    const jsonForm = JSON.stringify(draftForm);

    try {
        let response;
        if (requestFormId) {
            // PUT to update existing draft
            response = await fetch(`http://localhost:8000/user/${requestFormId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: jsonForm
            });
        } else {
            // POST to create new draft
            response = await fetch(`http://localhost:8000/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: jsonForm
            });
        }

        const result = await response.json();
        requestFormId = result.requestFormId;
        localStorage.setItem("requestFormId", requestFormId);

        localStorage.setItem("time",draftForm.details.date)
        let dateDraft = new Date()
        localStorage.setItem("Hour",dateDraft.getHours())
        localStorage.setItem("Minute",dateDraft.getMinutes())

        alert(requestFormId ? 'บันทึกแบบร่างสำเร็จ' : 'ไม่สามารถบันทึกแบบร่างได้');
    } catch (error) {
        console.error('Error:', error);
        alert('ไม่พบข้อมูลที่กรอกหรือกรอกไม่ครบ');
    }

    sessionStorage.setItem("buttonResign", "true");
});

submit.addEventListener("click", async () => {
    const submitData = {
        status: "รอดำเนินการ",
        state: "Published",
        type: "resign_course",
        details: {
            date: new Date().toLocaleDateString(),
            studentName: `${document.getElementById('title').value} ${document.getElementById('studentName').value} ${document.getElementById('studentLastName').value}`,
            studentId: document.getElementById('studentId').value,
            semester: document.getElementById('semester').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            subDistrict: document.getElementById('subDistrict').value,
            province: document.getElementById('province').value,
            contact: document.getElementById('contact').value,
            parentContactNumber: document.getElementById('parentContactNumber').value,
            advisor: document.getElementById('advisor').value,
            sinceSemester: document.getElementById('sinceSemester').value,
            semesterYear: `${document.getElementById('semesterYear').value}/${document.getElementById('semesterTerm').value}`,
            courseId: document.getElementById('courseId').value,
            courseName: document.getElementById('courseName').value,
            section: document.getElementById('section').value,
            requestReason: document.getElementById('requestReason').value
        }
    };

    const jsonData = JSON.stringify(submitData);

    try {
        const response = await fetch(`http://localhost:8000/user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
        });

        const result = await response.json();
        requestFormId = result.requestFormId;
        localStorage.setItem("requestFormId", requestFormId);

        if (requestFormId) {
            alert('ส่งคำร้องขอลาออกสำเร็จ');
            window.location.href = '/views/homepage.html'; // Adjust path if needed
        } else {
            alert('ส่งคำร้องไม่สำเร็จ');
        }
    } catch (error) {
        console.log("Error:", error);
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
});

cancel.addEventListener("click", () => {
    form.reset();
    window.location.href = "createForm.html";
});
