const addSubject = document.getElementById("addSubject")
const withDraw = document.getElementById("withDraw")
const resign = document.getElementById("resign")
const crossProgram = document.getElementById("crossProgram")

addSubject.addEventListener("click" , () => {
    window.location.href = "../views/request_add_subject.html";
})

withDraw.addEventListener("click",() => {
    window.location.href = "../views/request_withdraw.html";
})

resign.addEventListener("click",() => {
    window.location.href = "../views/resignation_form.html";
})

crossProgram.addEventListener("click",() => {
    window.location.href = "../views/request_cross_program.html";
})