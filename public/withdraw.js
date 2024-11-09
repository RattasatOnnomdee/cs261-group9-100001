const saveDraft = document.getElementById("save-draft")
const submit = document.getElementById("submit")
const cancel = document.getElementById("cancel")
const form = document.getElementById("withdrawForm")

saveDraft.addEventListener("click" ,async () => {
    const draftForm = {
        title: document.getElementById('title').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        student_id: document.getElementById('student_id').value,
        semester: document.getElementById('semester').value,
        address: document.getElementById('address').value,
        district: document.getElementById('district').value,
        sub_district: document.getElementById('sub_district').value,
        province: document.getElementById('province').value,
        phone: document.getElementById('phone').value,
        guardian_phone: document.getElementById('guardian_phone').value,
        advisor: document.getElementById('advisor').value,
        // pre_year: document.getElementById('pre_year').value,
        year: document.getElementById('year').value,
        term: document.getElementById('term').value,
        course_code: document.getElementById('course_code').value,
        course_name: document.getElementById('course_name').value,
        section: document.getElementById('section').value,
        reason: document.getElementById('reason').value
    }
    
    const userId = localStorage.getItem('userId');
    const jsonForm = JSON.stringify(draftForm)
    
    // if (!userId) {
    //     alert('กรุณาล็อกอินก่อน');
    //     return;
    // }
    try {
        const response = await fetch(`http://localhost:8000/user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonForm
        });
        
        const result = await response.json()
        if (result.message === "Draft saved successfully") {
            alert('บันทึกแบบร่างสำเร็จ');
        } else {
            alert('ไม่สามารถบันทึกแบบร่างได้');
        }    
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    sessionStorage.setItem("buttonWithDraw", "true");
    window.location.href = "Draft.html"
})

submit.addEventListener("click",async ()=>{
    const submitData = {
        type: "cross_program_registration", // ประเภทคำร้องคือการจดทะเบียนวิชาข้ามหลักสูตร
        details: {
            status: "รอดำเนินการ",
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
            sinceSemester: document.getElementById('pre_year').value,
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
    if (!userId) {
        alert('กรุณาล็อกอินก่อน');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/user/:${userId}` , {
            method : "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:jsonData
        })

        const result = await response.json();
        if (result.message === "Insert success") {
            alert('ส่งคำร้องขอจดทะเบียนวิชาข้ามหลักสูตรสำเร็จ');
            form.reset();
            window.location.href = '../views/homepage.html';
          } else {
            alert('ส่งคำร้องไม่สำเร็จ');
          }
    } catch (error) {
        console.log("Error : ",error)
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล")
    }
})

cancel.addEventListener("click",()=>{
    form.reset();
    window.location.href = "createForm.html"
})