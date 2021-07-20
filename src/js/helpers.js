
function addBudgetTotals(budgets) {
    //budgets is a [{id, category, budget:}]
    let total = 0;
    budgets.forEach(element => {
        total += element.budget;
    });
    //console.log(total);
    return (total);
};

// gross
function getMonthlyGrossIncomeAll(incomes) {
    let workHoursPerWeek = 40;
    let workWeeksPerMonth = 4;
    let grossIncome = 0;
    // income.incomeName, income.hourlyRate, income.taxRate, income.tithe income.retirement
    incomes.forEach(element => {
        grossIncome += (element.hourlyRate * workHoursPerWeek * workWeeksPerMonth);
    });
    return (grossIncome);
};

function getMonthlyGrossIncome(income) {
    let workHoursPerWeek = 40;
    let workWeeksPerMonth = 4;
    return (income.hourlyRate * workHoursPerWeek * workWeeksPerMonth);
};

// net
function getMonthlyNetIncome(income) {
    return (getMonthlyGrossIncome(income) - getTaxAmount(income) - getTitheAmount(income) - getRetirementAmount(income));
}
// exports.getMonthlyNetIncome = function(income) {
//     return (getMonthlyGrossIncome(income) - getTaxAmount(income) - getTitheAmount(income) - getRetirementAmount(income));
// };

function getMonthlyNetIncomeAll(incomes) {
    let netIncome = 0;
    incomes.forEach(element => {
        let thisNet = getMonthlyNetIncome(element);
        netIncome += thisNet;
    });
    return netIncome;
};




function getTitheAmount(income) {
    let thisGross = getMonthlyGrossIncome(income);
    return (thisGross * income.tithe);
};

function getTaxAmount(income) {
    let thisGross = getMonthlyGrossIncome(income);
    return (thisGross * income.taxRate);
};

function getRetirementAmount(income) {
    let thisGross = getMonthlyGrossIncome(income);
    return (thisGross * income.retirement);
};

module.exports = {
    addBudgetTotals: addBudgetTotals,
    getMonthlyGrossIncome: getMonthlyGrossIncome,
    getMonthlyNetIncomeAll: getMonthlyNetIncomeAll,
    getMonthlyNetIncome: getMonthlyNetIncome,
    getMonthlyGrossIncomeAll: getMonthlyGrossIncomeAll,
    getTitheAmount: getTitheAmount,
    getTaxAmount: getTaxAmount,
    getRetirementAmount: getRetirementAmount
}