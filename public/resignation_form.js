const saveDraft = document.getElementById("save-draft")
const submit = document.getElementById("submit")
const cancel = document.getElementById("cancel")
const form = document.getElementById("resignationForm")
// const userId = localStorage.getItem('userId');

saveDraft.addEventListener("click" , async () => {
    const draftForm = {
        status: "รอดำเนินการ",
        state : "Draft",
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
    }
    const userId = localStorage.getItem('userId');
    console.log(userId)
    const jsonForm = JSON.stringify(draftForm)
    try {
        const response = await fetch(`http://localhost:8000/user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonForm
        });
         if (!userId) {
            alert('กรุณาล็อกอินก่อน');
            return;
         }

        const result = await response.json()
        const requestFormId = result.requestFormId
        localStorage.setItem("requestFormId",result.requestFormId)
        if (requestFormId) {
            alert('บันทึกแบบร่างสำเร็จ');
        } else{
            alert('ไม่สามารถบันทึกแบบร่างได้');
            return;
        }    
        
      } catch (error) {
        console.error('Error:', error);
        alert('ไม่พบข้อมูลที่กรอกหรือกรอกไม่ครบ');
        return;
      }

    sessionStorage.setItem("buttonResign", "true");
    // window.location.href = "Draft.html"
})

submit.addEventListener("click",async ()=>{
    const submitData = {
        status: "รอดำเนินการ",
        state : "Published",
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

        const result = response.json()
        const requestFormId = result.requestFormId
        // localStorage.setItem("requestFormId",result.requestFormId)
        if (requestFormId) {
            alert('ส่งคำร้องขอลาออกสำเร็จ');
            localStorage.setItem("requestFormId", result.requestFormId);
            window.location.href = '/views/homepage.html';  // Make sure this path is correct
          } else {
            alert('ส่งคำร้องไม่สำเร็จ');
            return;
          }
    } catch (error) {
        console.log("Error : ",error)
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล")
        return
    }
})

cancel.addEventListener("click",()=>{
    form.reset();
    window.location.href = "createForm.html"
})