const cipher = require("../js/cipher.js");
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
};

function getMonthName(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()];
};


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
};

//* CRITICAL BUDGET ITEMS
async function getCritItms(mysql, userId) {
    let monthStart = getMonthStart(new Date());
    let monthEnd = getMonthEnd(new Date());
    let critItms = [];
    
    let budgetItms = await getBudgetItms(mysql, userId);
    for (budgetItm of budgetItms) {
        let tenPc = (budgetItm.budget / 10).toFixed(2);
        let itmTotal = await getTotalCategorySpend(mysql, budgetItm.id, monthStart, monthEnd, userId);
        if (budgetItm.budget - itmTotal <= tenPc) {
            critItms.push({"category": budgetItm.category, "amountLeft": (budgetItm.budget - itmTotal).toFixed(2)});
        };
    };
    return (critItms);
};

async function getBudgetItms(mysql, userId) {
    let sql = "SELECT * FROM BUDGETS WHERE userId=?;";
    let myPromise = new Promise((resolve, reject) => {
        mysql.query(sql,[userId], (err, budgets) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(budgets);
        });
    });
    return(await myPromise);
};

async function getTotalCategorySpend(mysql, categoryItmId, monthStart, monthEnd, userId) {
    let sql = "SELECT amount FROM monthSpending WHERE category=? AND purchaseDate >= ? AND purchaseDate <= ? AND userId=?;";
    let myPromise = new Promise((resolve, reject) => {
        let totalSpend = 0;
        mysql.query(sql, [categoryItmId, monthStart, monthEnd, userId], (err, amounts) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            amounts.forEach(amount => {
                totalSpend += parseFloat(cipher.decryptString(amount.amount, process.env.KEY));
            });
            resolve(totalSpend);
        });
    });
    return (await myPromise);
};
//* END CRITICAL BUDGET ITEMS

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
    getCritItms: getCritItms
}