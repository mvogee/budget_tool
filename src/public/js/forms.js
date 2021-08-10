async function newBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value
    };
    fetchCall(data, "POST", "/budgets");
};

async function deleteBudgetItem(form) {
    let data = {
        deleteCategory: form.deleteCategory.value,
    };
    fetchCall(data, "DELETE", "/budgets");
};

async function updateBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value,
        itemId: form.id.value
    }
    await fetchCall(data, "PATCH", "/budgets");
};

async function fetchCall(data, method, route) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        fetch(route, {
            headers: myHeaders,
            body: JSON.stringify(data),
            method: method
        })
        .then(location.reload());
};