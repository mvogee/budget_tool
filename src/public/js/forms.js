
//* OLD fetchCall. - would load page before database update completed
// async function fetchCall(data, method, route) {
//     let myHeaders = new Headers();
//     myHeaders.append('Content-Type', 'application/json');
//     fetch(route, {
//         headers: myHeaders,
//         body: JSON.stringify(data),
//         method: method
//     });
// };

async function fetchCall(data, method, route) {
    return (new Promise(function (resolve, reject) {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        fetch(route, {
            headers: myHeaders,
            body: JSON.stringify(data),
            method: method
        }).then(() => {
            console.log("fetch resolve");
            resolve("done");
        })
        .catch(() => {
            console.log("in catch condition fetchTestCall");
            reject(new Error("An error occured"));
        });
        //! how to handle errors?
    })
    );
};

// * BUDGET FORMS
async function newBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value
    };
    let fcPromise = fetchCall(data, "POST", "/budgets");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    })
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

async function deleteBudgetItem(form) {
    let data = {
        deleteCategory: form.deleteCategory.value,
    };
    let fcPromise = fetchCall(data, "DELETE", "/budgets");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

async function updateBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value,
        itemId: form.id.value
    };
    let fcPromise = fetchCall(data, "PATCH", "/budgets");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
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
    let fcPromise =  fetchCall(data, "POST", "/income");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

async function deleteIncomeItem(form) {
    let data = {
        deleteIncome: form.deleteIncome.value
    };
    let fcPromise = fetchCall(data, "DELETE", "/income");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
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
    let fcPromise = fetchCall(data, "PATCH", "/income");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

// * THIS MONTH FORMS
// - spending items
async function newSpendingItem(form) {
    let data = {
        itemName: form.itemName.value,
        amount: form.amount.value,
        category: form.category.value,
        date: form.date.value
    };
    let fcPromise = fetchCall(data, "POST", "/spendingItem");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

async function deleteSpendingItem(form) {
    let data = {
        deleteSpendingItm: form.deleteSpendingItm.value
    };
    let fcPromise = fetchCall(data, "DELETE", "/spendingItem");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

async function updateSpendingItem(form) {
    let data = {
        itemName: form.itemName.value,
        amount: form.amount.value,
        category: form.category.value,
        date: form.date.value,
        itmId: form.itmId.value
    };
    let fcPromise = fetchCall(data, "PATCH", "/spendingItem");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

// deposit items
async function newDepositItem(form) {
    let data = {
        itemName: form.itemName.value,
        amount: form.amount.value,
        date: form.date.value
    };
    let fcPromise = fetchCall(data, "POST", "/depositItem");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
};

async function deleteDepositItem(form) {
    let data = {
        deleteIncomeItm: form.deleteIncomeItm.value
    }
    let fcPromise = fetchCall(data, "DELETE", "/depositItem");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
}

async function updateDepositItem(form) {
    let data = {
        itemName: form.itemName.value,
        amount: form.amount.value,
        date: form.date.value,
        itmId: form.itmId.value
    };
    let fcPromise = fetchCall(data, "PATCH", "/depositItem");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
}