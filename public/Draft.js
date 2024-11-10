const draftForm = document.getElementById("draftForm");
const requestFormId = localStorage.getItem("requestFormId");
const userId = localStorage.getItem("userId");


async function loadAllDrafts() {
    // Get drafts array from localStorage, or initialize if doesn't exist
    const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
    
    if (drafts.length === 0) {
        draftForm.innerHTML = '<p>ไม่พบข้อมูล...</p>';
        return;
    }

    draftForm.innerHTML = "";
    drafts.forEach((draft, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        wrapper.setAttribute("data-draft-index", index);

        const textContainer = document.createElement("div");
        textContainer.classList.add("textContainer");
        wrapper.appendChild(textContainer);

        const text = document.createElement("h1");
        text.classList.add("text");
        text.innerText = draft.title;
        textContainer.appendChild(text);

        const date = document.createElement("h1");
        date.classList.add("date");
        date.innerText = draft.date;
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

        btn2.addEventListener("click", async () => {
            const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
            drafts.splice(index, 1);
            localStorage.setItem("drafts", JSON.stringify(drafts));
            
            if (draft.requestFormId) {
                await fetch(`http://localhost:8000/user/${draft.requestFormId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            wrapper.remove();
            if (draftForm.children.length === 0) {
                draftForm.innerHTML = '<p>ไม่พบข้อมูล...</p>';
            }
        });

        btn1.addEventListener("click", async () => {
            await fetch(`http://localhost:8000/user/draft/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Store the draft index for editing
            localStorage.setItem("currentEditDraftIndex", index);
            sessionStorage.setItem(draft.adjustKey, "true");
            history.back();
        });
    });
}

function createDraft(title, sessionKey, adjustKey) {
    if (sessionStorage.getItem(sessionKey) === "true") {
        sessionStorage.removeItem(sessionKey);

        const dateNow = new Date();
        const formattedDate = `แก้ไขล่าสุดเมื่อ ${String(dateNow.getDate())}/${String(dateNow.getMonth() + 1)}/${dateNow.getFullYear()} ${String(dateNow.getHours()).padStart(2, '0')}:${String(dateNow.getMinutes()).padStart(2, '0')} น.`;

        const draftContent = {
            title: title,
            date: formattedDate,
            adjustKey: adjustKey,
            requestFormId: localStorage.getItem("requestFormId")
        };

        // Get existing drafts or initialize new array
        const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
        drafts.push(draftContent);
        localStorage.setItem("drafts", JSON.stringify(drafts));

        loadAllDrafts();
    }
}

// Initialize page
document.addEventListener("DOMContentLoaded", loadAllDrafts);
createDraft("แบบร่างเขียนคำร้องจดทะเบียนข้ามโครงการ", "buttonRegisterCross", "adjustCrossProgram");
createDraft("แบบร่างเขียนคำร้องขอลาออก", "buttonResign", "adjustResign");
createDraft("แบบร่างเขียนคำร้องจดทะเบียนล่าช้า", "buttonAddSubject", "adjustAddSubject");
createDraft("แบบร่างเขียนคำร้องถอนรายวิชา", "buttonWithDraw", "adjustWithDraw");
