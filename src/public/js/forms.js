
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

// async function fetchCallOLD(data, method, route) {
//     return (new Promise(function (resolve, reject) {
//         let myHeaders = new Headers();
//         myHeaders.append('Content-Type', 'application/json');
//         fetch(route, {
//             headers: myHeaders,
//             body: JSON.stringify(data),
//             method: method
//         }).then(() => {
//             console.log("fetch resolve");
//             resolve("done");
//         })
//         .catch(() => { // this is sometimes triggering before the database is updated
//             console.log("in catch condition fetchTestCall");
//             reject(new Error("An error occured"));
//         });
//         //! how to handle errors?
//     })
//     );
// }
//*fetchCall wrewrite-------

async function fetchCall(data, method, route) {
    let myPromise = new Promise(async (resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let servResponse = await fetch(route, {
            headers: headers,
            body: JSON.stringify(data),
            method: method
        });
        console.log("servResponse" + servResponse);
        resolve(await servResponse);
    });
    return (await myPromise);
}

// * BUDGET FORMS

async function newBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value
    };
    await fetchCall(data, "POST", "/budgets")
    .then((response) => {
        console.log(response);
        location.reload();
    }).catch((err) => {
        location.reload();
        console.log(err);
    });
}

async function deleteBudgetItem(form) {
    if (await confirmDelete(form.deleteName.value) === false) {
        return ;
    }
    let data = {
        deleteCategory: form.deleteCategory.value,
    };
    await fetchCall(data, "DELETE", "/budgets")
    .then((response) => {
        console.log(response);
        location.reload();
    })
    .catch(() => {
        location.reload();
        console.log("error occured");
    });
}

async function updateBudgetItem(form) {
    let data = {
        category: form.category.value,
        budgeted: form.budgeted.value,
        itemId: form.id.value
    };
    await fetchCall(data, "PATCH", "/budgets")
    .then((response) => {
        console.log(response);
        location.reload();
    })
    .catch((err) => {
        location.reload();
        console.log(err);
    });
}

// * INCOME FORMS

async function newIncomeItem(form) {
    let data = {
        incomeName: form.incomeName.value,
        hourlyRate: form.hourlyRate.value,
        taxRate: form.taxRate.value,
        retirement: form.retirement.value,
        hoursPerWeek: form.hoursPerWeek.value
    };
    let fcPromise = fetchCall(data, "POST", "/income");
    fcPromise.then(() => {
        console.log("fcPromise resolved, page reloading");
        location.reload();
    });
    fcPromise.catch(() => {
        location.reload();
        console.log(fcPromise);
    });
}

async function deleteIncomeItem(form) {
    if (await confirmDelete(form.deleteName.value) === false) {
        return ;
    }
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
}

async function updateIncomeItem(form) {
    let data = {
        incomeName: form.incomeName.value,
        hourlyRate: form.hourlyRate.value,
        taxRate: form.taxRate.value,
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
}

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
}

async function deleteSpendingItem(form) {
    if (await confirmDelete(form.deleteName.value) === false) {
        return ;
    }
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
}

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
}

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
}

async function deleteDepositItem(form) {
    if (await confirmDelete(form.deleteName.value) === false) {
        return ;
    }
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

async function confirmDelete(itemName) {
    let message = "Delete " + itemName + " ?";
    if (confirm(message) === true) {
        return Promise.resolve(true);
    }
    else {
        return (Promise.resolve(false));
    }
}