
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
    let workWeeksPerMonth = 4;
    let grossIncome = 0;
    // income.incomeName, income.hourlyRate, income.taxRate, income.tithe income.retirement
    incomes.forEach(element => {
        grossIncome += (element.hourlyRate * element.hoursPerWeek * workWeeksPerMonth);
    });
    return (grossIncome);
};

function getMonthlyGrossIncome(income) {
    let workHoursPerWeek = 40;
    let workWeeksPerMonth = 4;
    return (income.hourlyRate * income.hoursPerWeek * workWeeksPerMonth);
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

function getStandardDateFormat(date) {
    let m = (date.getMonth() + 1).toString();
    let y = date.getFullYear().toString();
    let d = date.getDate().toString();
    if (date.getMonth() + 1 < 10) {
        m = "0" + m;
    }
    if (date.getDate() < 10) {
        d = "0" + d;
    }

    return (y + "-" + m + "-" + d);
}

function getMonthStart(date) {
    let m = (date.getMonth() + 1).toString();
    if (date.getMonth() + 1 < 10) {
        m = "0" + m;
    }
    let y = date.getFullYear().toString();
    let monthStart = y + "-" + m + "-01";
    return (monthStart);
};

function getMonthEnd(date) {
    let y = date.getFullYear().toString();
    let m = (date.getMonth() + 1).toString();
    if (date.getMonth() + 1 < 10) {
        m = "0" + m;
    }
    let d = new Date(y,m, 0).getDate().toString();
    return (y+"-" + m + "-" +d);
}

function getMonthName(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()];
}


function getCategoryName(categorys, id) {
    if (id === 0) {
        return ("uncategorized");
    }
    for (let i = 0; i < categorys.length; i++) {
        if (categorys[i].id === id) {
            return (categorys[i].category);
        }
    }
    return ("uncategorized");
}
 // !BUG--- FIX ME
 //? promise is being resolved before database queries are finished executing
function getCriticalBudgetItems(mysql) {
    let monthStart = getMonthStart(new Date());
    let monthEnd = getMonthEnd(new Date());
    let criticalItms = [];
     return new Promise((resolve, reject) => {
        let budgetsPromise = new Promise((res, rej) => {
            mysql.query("SELECT * FROM budgets;", (err, budgets) => {
                if (err) {
                    console.log(err);
                    rej(err);
                }
                else {
                    res(budgets);
                }
            });
        });
        budgetsPromise.then(budgets => {
            budgets.forEach(budgetItm => {
                console.log("topForEach")
                let tenPC = (budgetItm.budget / 10).toFixed(2);
                let sql = "SELECT amount FROM monthSpending WHERE category=? AND purchaseDate >= ? AND purchaseDate <= ?;";
                //! BUG IS THAT query is not blocking !!!!
                //! data has to be returned from inside the sql qeury callback
                mysql.query(sql, [budgetItm.id, monthStart, monthEnd], (error, amounts) => {
                    let totalSpent = 0;
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    amounts.forEach(amount => totalSpent += amount.amount);
                    if (budgetItm.budget - totalSpent <= tenPC) {
                        criticalItms.push({[budgetItm.category] : (budgetItm.budget - totalSpent).toFixed(2)});
                    }
                    console.log("done query Call back");
                })
            });
            //! Resolving before any database calls are made.
            console.log("resolving criticalItms");
            resolve(criticalItms);
        });
    });
};


async function getCritItms(mysql) {
    let monthStart = getMonthStart(new Date());
    let monthEnd = getMonthEnd(new Date());
    let critItms = [];
    
    let budgetItms = await getBudgetItms(mysql);
    // loop through budget items
    budgetItms.forEach(budgetItm => {
        let itmTotal = getTotalCategorySpend(mysql, budgetItm.id, monthStart, monthEnd);
        console.log(itmTotal);
    });
}
//* THIS IS WORKING CORRECTLY
async function getBudgetItms(mysql) {
    let sql = "SELECT * FROM BUDGETS;";
    let myPromise = new Promise((resolve, reject) => {
        mysql.query(sql, (err, budgets) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(budgets);
        });
    });
    return(await myPromise);
};

// * this will return the total spend of a category after
async function getTotalCategorySpend(mysql, categoryItmId, monthStart, monthEnd) {
    
    let sql = "SELECT amount FROM monthSpending WHERE category=? AND purchaseDate >= ? AND purchaseDate <= ?;";
    let myPromise = new Promise((resolve, reject) => {
        let totalSpend = 0;
        mysql.query(sql, [categoryItmId, monthStart, monthEnd], (err, amounts) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            amounts.forEach(amount => totalSpend += amount.amount);
            resolve(totalSpend);
        });
    });
    return (await myPromise);
};

//! END BUG SECTION
module.exports = {
    addBudgetTotals: addBudgetTotals,
    getMonthlyGrossIncome: getMonthlyGrossIncome,
    getMonthlyNetIncomeAll: getMonthlyNetIncomeAll,
    getMonthlyNetIncome: getMonthlyNetIncome,
    getMonthlyGrossIncomeAll: getMonthlyGrossIncomeAll,
    getTitheAmount: getTitheAmount,
    getTaxAmount: getTaxAmount,
    getRetirementAmount: getRetirementAmount,
    getMonthStart: getMonthStart,
    getMonthEnd: getMonthEnd,
    getMonthName: getMonthName,
    getStandardDateFormat: getStandardDateFormat,
    getCategoryName: getCategoryName,
    getCriticalBudgetItems: getCriticalBudgetItems,

    //!tests
    getCritItms: getCritItms
}