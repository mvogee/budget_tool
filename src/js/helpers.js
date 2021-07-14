
exports.addBudgetTotals = function (budgets) {
    //budgets is a [{id, category, budget:}]
    let total = 0;
    budgets.forEach(element => {
        total += element.budget;
    });
    //console.log(total);
    return (total);
};
