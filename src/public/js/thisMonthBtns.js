
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
    // Should also toggle the popup menu to display block
};
let cancelEditBtn = document.querySelector("#editCancelBtn");
cancelEditBtn.addEventListener("click", (eventSource) => {
    console.log("cancle was pressed");
    cancleButtonClick(eventSource)
});

function cancleButtonClick(event) {
    let nameField = document.querySelector(".editNameInput");
    let amountField = document.querySelector(".editAmountInput");
    let categoryField = document.querySelector(".editCategoryInput");
    let dateField = document.querySelector(".editDateInput");
    let idField = document.querySelector(".itmId");

    nameField.setAttribute("Value", "");
    amountField.setAttribute("Value", "");
    categoryField.value = 0;
    dateField.setAttribute("Value", "");
    idField.setAttribute("Value", 0);
    // should also toggle popup menu to disply none
};