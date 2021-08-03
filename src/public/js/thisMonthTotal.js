const monthSpending = document.querySelector("#totalSpending");
const monthIncome = document.querySelector("#totalIncome");
const savings = document.querySelector("#totalSavings");

const spendingItms = document.querySelectorAll("#spendingAmount");
const incomeItms = document.querySelectorAll("#incomeAmount");

function getTotal(elementArray) {
    let total = 0.00;
    elementArray.forEach(element => {
        total += parseFloat(element.innerHTML.slice(1));
    });
    return (total);
};

let spendingTotal = getTotal(spendingItms);
let incomeTotal = getTotal(incomeItms);
let dif = (incomeTotal - spendingTotal).toFixed(2);

monthSpending.innerHTML = spendingTotal;
monthIncome.innerHTML = incomeTotal;
savings.innerHTML = dif;

// edit button behavior

let editBtn = document.querySelectorAll(".editButton");
editBtn.forEach(btn => {
    btn.addEventListener("click", (EventSource) => {
        console.log("button was pressed");
        console.log(EventSource.target.getAttribute("purchaseAmount"));
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
    
};