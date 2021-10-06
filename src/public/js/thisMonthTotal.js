const monthSpending = document.querySelector("#totalSpending");
const monthIncome = document.querySelector("#totalIncome");
const savings = document.querySelector("#totalSavings");

const spendingItms = document.querySelectorAll(".spendingAmount");
const incomeItms = document.querySelectorAll(".incomeAmount");

function getTotal(elementArray) {
    let total = 0.00;
    elementArray.forEach(element => {
        total += parseFloat(element.innerHTML.slice(1));
    });
    return (total);
};

let spendingTotal = getTotal(spendingItms).toFixed(2);
let incomeTotal = getTotal(incomeItms).toFixed(2);
let dif = (incomeTotal - spendingTotal).toFixed(2);

monthSpending.innerHTML = spendingTotal;
monthIncome.innerHTML = incomeTotal;
savings.innerHTML = dif;

// * Budget +-

const budgetrows = document.querySelectorAll(".budgetProgress tbody tr");
budgetrows.forEach(element => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let category = element.getAttribute("catId");
    // make request to server for all the spending items from monthSpending with the current dt purchaseDate and with ccategory = category
    let data = {
        categoryId: category,
        date: document.querySelector("#changeMonthInput").value
    }
    fetch("/queryMonthSpendCategory",
            {headers: myHeaders,
            body: JSON.stringify(data),
            method: "POST"})
            .then(response => response.json()
                .then(data => {
                    let totalSpent = data.total.toFixed(2);
                    let budgeted = element.querySelector(".budgeted").innerText.substring(1);
                    element.querySelector(".spent").innerHTML = "$"+ totalSpent;
                    element.querySelector(".leftInBudget").innerHTML = "$"+(budgeted - totalSpent).toFixed(2);

                })
            );
});