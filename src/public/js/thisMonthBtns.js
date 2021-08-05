
let editBtn = document.querySelectorAll(".editButton");
editBtn.forEach(btn => {
    btn.addEventListener("click", (EventSource) => {
        console.log("edit button was pressed");
        editButtonClick(EventSource);
    });
});

function editButtonClick(event) {
    let itmId = event.target.getAttribute("itmId");
    let name = event.target.getAttribute("name");
    let purchaseAmount = event.target.getAttribute("purchaseAmount");
    let categoryId = event.target.getAttribute("categoryId");
    let pdate = event.target.getAttribute("purchaseDate");

    let nameField = document.querySelector(".editNameInput");
    let amountField = document.querySelector(".editAmountInput");
    let categoryField = document.querySelector(".editCategoryInput");
    let dateField = document.querySelector(".editDateInput");
    let idField = document.querySelector(".itmId");

    nameField.setAttribute("Value", name);
    amountField.setAttribute("Value", purchaseAmount);
    categoryField.value = categoryId;
    dateField.setAttribute("Value", pdate);
    idField.setAttribute("Value", itmId);
    //! Should toggle the popup menu to display block
    //! Should see if hidePopupEdit is already in classList or not and toggle based on that
    document.querySelector("#popupEditSpending").classList.toggle("hidePopupEdit");
};

// Cancle button functionality
let cancelEditBtn = document.querySelector("#editCancelBtnSpending");
cancelEditBtn.addEventListener("click", (event) => {
    console.log("cancle was pressed");
    document.querySelector("#popupEditSpending").classList.toggle("hidePopupEdit");
    document.querySelector("#updateIncomeItem").reset();
});

