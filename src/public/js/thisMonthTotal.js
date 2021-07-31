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

