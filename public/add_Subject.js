const saveDraft = document.getElementById("save-draft")
const submit = document.getElementById("submit")
const cancel = document.getElementById("cancel")
const form = document.getElementById("add-subject-form")

const userId = localStorage.getItem('userId');
let requestFormId = localStorage.getItem("requestFormId");

saveDraft.addEventListener("click" , async () => {
    const draftForm = {
        status: "รอดำเนินการ",
        state : "Draft",
        type: "addSubject_course",
        details: {
            date: new Date().toLocaleDateString(),
            studentName: `${document.getElementById('title').value} ${document.getElementById('first_name').value} ${document.getElementById('last_name').value}`,
            studentId: document.getElementById('student_id').value,
            year: document.getElementById('semester').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            subDistrict: document.getElementById('sub_district').value,
            province: document.getElementById('province').value,
            contact: document.getElementById('phone').value,
            parentContactNumber: document.getElementById('guardian_phone').value,
            advisor: document.getElementById('advisor').value,
            // sinceSemester: document.getElementById('pre_year').value,
            semester: `${document.getElementById('year').value}/${document.getElementById('term').value}`,
            courseId: document.getElementById('course_code').value,
            courseName: document.getElementById('course_name').value,
            section: document.getElementById('section').value,
            requestReason: document.getElementById('reason').value
        }
    }
    // const userId = localStorage.getItem('userId');
    const jsonForm = JSON.stringify(draftForm)
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
        localStorage.setItem("time",draftForm.details.date)
        let dateDraft = new Date()
        localStorage.setItem("Hour",dateDraft.getHours())
        localStorage.setItem("Minute",dateDraft.getMinutes())
        alert(requestFormId ? 'บันทึกแบบร่างสำเร็จ' : 'ไม่สามารถบันทึกแบบร่างได้');
    } catch (error) {
        console.error('Error:', error);
        alert('ไม่พบข้อมูลที่กรอกหรือกรอกไม่ครบ');
    }

    // sessionStorage.setItem("buttonResign", "true");

    sessionStorage.setItem("buttonAddSubject", "true");
    // window.location.href = "Draft.html"
})

submit.addEventListener("click",async ()=>{
    const submitData = {
        status: "รอดำเนินการ",
        state : "Published",
        type: "addSubject_course",
        details: {
            date: new Date().toLocaleDateString(),
            studentName: `${document.getElementById('title').value} ${document.getElementById('first_name').value} ${document.getElementById('last_name').value}`,
            studentId: document.getElementById('student_id').value,
            year: document.getElementById('semester').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            subDistrict: document.getElementById('sub_district').value,
            province: document.getElementById('province').value,
            contact: document.getElementById('phone').value,
            parentContactNumber: document.getElementById('guardian_phone').value,
            advisor: document.getElementById('advisor').value,
            // sinceSemester: document.getElementById('pre_year').value,
            semester: `${document.getElementById('year').value}/${document.getElementById('term').value}`,
            courseId: document.getElementById('course_code').value,
            courseName: document.getElementById('course_name').value,
            section: document.getElementById('section').value,
            requestReason: document.getElementById('reason').value
        }
    };
    const jsonData = JSON.stringify(submitData)
    // const dateSubmit = new Date();
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`http://localhost:8000/user/${userId}` , {
            method : "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:jsonData
        })
         if (!userId) {
            alert('กรุณาล็อกอินก่อน');
            return;
        }

        const result = await response.json();
        const requestFormId = result.requestFormId
        // localStorage.setItem("requestFormId",result.requestFormId)
        if (requestFormId) {
            alert('ส่งคำร้องขอจดทะเบียนล่าช้าสำเร็จ');
            localStorage.setItem("requestFormId", result.requestFormId);
            window.location.href = '/views/homepage.html';  // Make sure this path is correct
          } else {
            alert('ส่งคำร้องไม่สำเร็จ');
            return;
          }
          
    } catch (error) {
        console.log("Error : ",error)
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล")
        return;
    }
})

cancel.addEventListener("click",()=>{
    form.reset();
    window.location.href = "createForm.html"
})