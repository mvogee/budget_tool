async function fetchCall(data, method, route) {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    fetch(route, {
        headers: myHeaders,
        body: JSON.stringify(data),
        method: method
    });
};

// * BUDGET FORMS
async function newBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value
    };
    await fetchCall(data, "POST", "/budgets");
    location.reload();
};

async function deleteBudgetItem(form) {
    let data = {
        deleteCategory: form.deleteCategory.value,
    };
    await fetchCall(data, "DELETE", "/budgets");
    location.reload();
};

async function updateBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value,
        itemId: form.id.value
    };
    await fetchCall(data, "PATCH", "/budgets");
    location.reload();
};

// * INCOME FORMS

async function newIncomeItem(form) {
    let data = {
        incomeName: form.incomeName.value,
        hourlyRate: form.hourlyRate.value,
        taxRate: form.taxRate.value,
        tithe: form.tithe.value,
        retirement: form.retirement.value,
        hoursPerWeek: form.hoursPerWeek.value
    };
    await fetchCall(data, "POST", "/income");
    location.reload();
};

async function deleteIncomeItem(form) {
    let data = {
        deleteIncome: form.deleteIncome.value
    };
    await fetchCall(data, "DELETE", "/income");
    location.reload();
};

async function updateIncomeItem(form) {
    let data = {
        incomeName: form.incomeName.value,
        hourlyRate: form.hourlyRate.value,
        taxRate: form.taxRate.value,
        tithe: form.tithe.value,
        retirement: form.retirement.value,
        hoursPerWeek: form.hoursPerWeek.value,
        itmId: form.itmId.value
    };
    await fetchCall(data, "PATCH", "/income");
    location.reload();
};