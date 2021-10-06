
let editBtnSpending = document.querySelectorAll(".editBtnSpend");
editBtnSpending.forEach(btn => {
    btn.addEventListener("click", (event) => {
        console.log("edit button was pressed");
        editButtonSpendigClick(event);
    });
});

function editButtonSpendigClick(event) {
    let itmId = event.target.getAttribute("itmId");
    let name = event.target.getAttribute("name");
    let purchaseAmount = event.target.getAttribute("purchaseAmount");
    let categoryId = event.target.getAttribute("categoryId");
    let pdate = event.target.getAttribute("purchaseDate");

    let nameField = document.querySelector("#updateSpendingItem .editNameInput");
    let amountField = document.querySelector("#updateSpendingItem .editAmountInput");
    let categoryField = document.querySelector("#updateSpendingItem .editCategoryInput");
    let dateField = document.querySelector("#updateSpendingItem .editDateInput");
    let idField = document.querySelector("#updateSpendingItem .itmId");

    nameField.setAttribute("Value", name);
    amountField.setAttribute("Value", purchaseAmount);
    categoryField.value = categoryId;
    dateField.setAttribute("Value", pdate);
    idField.setAttribute("Value", itmId);
    //! Should toggle the popup menu to display block
    //! Should see if hidePopupEdit is already in classList or not and toggle based on that
    document.querySelector("#popupEditSpending").classList.toggle("hidePopupEdit");
};

let editButtonDeposit = document.querySelectorAll(".editBtnDeposit");
editButtonDeposit.forEach(btn => {
    btn.addEventListener("click", (event) => {
        console.log("btn clicked");
        editButtonDepositClick(event);
    });
});


function editButtonDepositClick(event) {
    let itmId = event.target.getAttribute("itmId");
    let name = event.target.getAttribute("name");
    let incomeAmount = event.target.getAttribute("incomeAmount");
    let ddate = event.target.getAttribute("depositDate");

    let nameField =  document.querySelector("#updateDepositItem .editNameInput");
    let amountField = document.querySelector("#updateDepositItem .editAmountInput");
    let dateField = document.querySelector("#updateDepositItem .editDateInput");
    let idField = document.querySelector("#updateDepositItem .itmId");

    nameField.setAttribute("Value", name);
    amountField.setAttribute("Value", incomeAmount);
    dateField.setAttribute("Value", ddate);
    idField.setAttribute("Value", itmId);
    //! Should toggle the popup menu to display block
    //! Should see if hidePopupEdit is already in classList or not and toggle based on that
    document.querySelector("#popupEditDeposit").classList.toggle("hidePopupEdit");
}

// Cancle button functionality
let cancelEditBtnSpending = document.querySelector("#editCancelBtnSpending");
cancelEditBtnSpending.addEventListener("click", (type) => {
    console.log("cancle was pressed");
    document.querySelector("#popupEditSpending").classList.toggle("hidePopupEdit");
    document.querySelector("#updateSpendingItem").reset();
});

let cancelEditBtnDeposit = document.querySelector("#editCancelBtnDeposit");
cancelEditBtnDeposit.addEventListener("click", (type) => {
    console.log("cancel was pressed");
    document.querySelector("#popupEditDeposit").classList.toggle("hidePopupEdit");
    document.querySelector("#updateDepositItem").reset();
});

function changeMonth() {
    let date = document.querySelector("#changeMonthInput").value;
    window.location.href = "/thisMonth/" + date;
}