

let editBtns = document.querySelectorAll(".editButton");
editBtns.forEach(btn => {
    btn.addEventListener("click", (event) => {
        console.log("edit button was clicked");
        edtiIncomeBtnClick(event);
    });
});

function edtiIncomeBtnClick(event) {
    let itmId = event.target.getAttribute("itmId");
    let name = event.target.getAttribute("name");
    let hourlyRate = event.target.getAttribute("hourlyRate");
    let hoursPerWeek = event.target.getAttribute("hoursPerWeek");
    let taxRate = event.target.getAttribute("taxRate");
    let tithe = event.target.getAttribute("tithe");
    let retirement = event.target.getAttribute("retirement");

    let idField = document.querySelector(".incomeItemUpdate .idInput");
    let nameField = document.querySelector(".incomeItemUpdate .nameInput");
    let hourlyRateField = document.querySelector(".incomeItemUpdate .hourlyRateInput");
    let hoursPerWeekField = document.querySelector(".incomeItemUpdate .hoursPerWeek");
    let taxRateField = document.querySelector(".incomeItemUpdate .taxRateInput");
    let titheFeild = document.querySelector(".incomeItemUpdate .titheInput");
    let retirementField = document.querySelector(".incomeItemUpdate .retirementInput");

    idField.setAttribute("value", itmId);
    nameField.setAttribute("value", name);
    hourlyRateField.setAttribute("value", hourlyRate);
    hoursPerWeekField.setAttribute("value", hoursPerWeek);
    taxRateField.setAttribute("value", taxRate);
    titheFeild.setAttribute("value", tithe);
    retirementField.setAttribute("value", retirement);

    document.querySelector("#popupIncomeItemUpdate").classList.toggle("hidePopupEdit");
};


let cancelBtn = document.querySelector(".incomeItemUpdate .cancelBtn");
cancelBtn.addEventListener("click", (event) => {
    console.log("cancel was clicked");
    document.querySelector("#popupIncomeItemUpdate").classList.toggle("hidePopupEdit");
    document.querySelector("#popupIncomeItemUpdate .incomeItemUpdate").reset();
});