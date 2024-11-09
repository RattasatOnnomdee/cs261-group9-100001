const draftForm = document.getElementById("draftForm");

function createDraft(title, sessionKey, adjustKey) {
    if (sessionStorage.getItem(sessionKey) === "true") {
        sessionStorage.removeItem(sessionKey);  // Optionally clear after checking
        if (draftForm) {
            draftForm.innerHTML = "";

            const wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");

            const textContainer = document.createElement("div");
            textContainer.classList.add("textContainer");
            wrapper.appendChild(textContainer);

            const text = document.createElement("h1");
            text.classList.add("text");
            text.innerText = title;
            textContainer.appendChild(text);

            const date = document.createElement("h1");
            date.classList.add("date");
            const dateNow = new Date();
            date.innerText = `แก้ไขล่าสุดเมื่อ   ${String(dateNow.getDate())}/${String(dateNow.getMonth() + 1)}/${dateNow.getFullYear()}   ${String(dateNow.getHours()).padStart(2, '0')}:${String(dateNow.getMinutes()).padStart(2, '0')} น.`;
            textContainer.appendChild(date);

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("btnContainer");
            wrapper.appendChild(btnContainer);

            const btn1 = document.createElement("button");
            btn1.classList.add("btn1");
            btn1.innerText = "แก้ไข";
            btnContainer.appendChild(btn1);

            const btn2 = document.createElement("button");
            btn2.classList.add("btn2");
            btn2.innerText = "ยกเลิก";
            btnContainer.appendChild(btn2);

            draftForm.appendChild(wrapper);

            btn2.addEventListener("click", () => {
                wrapper.remove();
                if (draftForm.children.length === 0) {
                    draftForm.innerHTML = '<p>ไม่พบข้อมูล...</p>';
                }
            });

            btn1.addEventListener("click", () => {
                sessionStorage.setItem(adjustKey, "true");
                history.back();
            });
        }
    }
}

createDraft("แบบร่างเขียนคำร้องจดทะเบียนข้ามโครงการ", "buttonRegisterCross", "adjustCrossProgram");
createDraft("แบบร่างเขียนคำร้องขอลาออก", "buttonResign", "adjustResign");
createDraft("แบบร่างเขียนคำร้องจดทะเบียนล่าช้า", "buttonAddSubject", "adjustAddSubject");
createDraft("แบบร่างเขียนคำร้องถอนรายวิชา", "buttonWithDraw", "adjustWithDraw");
