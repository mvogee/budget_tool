let editBtns = document.querySelectorAll(".editButtonBudgets");

editBtns.forEach(btn => {
    btn.addEventListener("click", (event) => {
        editBudgetBtnClick(event);
    });
});

function editBudgetBtnClick(event) {
    let itmId = event.target.getAttribute("itmId");
    let category = event.target.getAttribute("category");
    let budget = event.target.getAttribute("budget");

    let itmIdField = document.querySelector(".idInput");
    let categoryField = document.querySelector(".categoryInput");
    let budgetField = document.querySelector(".amountInput");

    itmIdField.setAttribute("value", itmId);
    categoryField.setAttribute("value", category);
    budgetField.setAttribute("value", budget);

    document.querySelector("#popupBudgetItemUpdate").classList.toggle("hidePopupEdit");
};

document.querySelector("#popupBudgetItemUpdate .cancelBtn").addEventListener("click", (event) => {
    document.querySelector(".budgetItemUpdate").reset;
    document.querySelector("#popupBudgetItemUpdate").classList.toggle("hidePopupEdit");
});

