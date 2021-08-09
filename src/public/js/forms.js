async function newBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value
    };
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    fetch("/budgets", {
        headers: myHeaders,
        body: JSON.stringify(data),
        method: "POST"
    })
    .then(location.reload());
};