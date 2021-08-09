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
    return true;
};

async function deleteBudgetItem(form) {
    let data = {
        deleteCategory: form.deleteCategory.value,
    };
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    fetch("/budgets", {
        headers: myHeaders,
        body: JSON.stringify(data),
        method: "DELETE"
    })
    .then(location.reload);
    return true;
};