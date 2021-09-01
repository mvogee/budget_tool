//! route is not set up for this yet
async function getData(route) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let opts = {
        headers: headers,
        method: "GET"
    };
    const res = await fetch(route, opts);
    console.log(res);
    const data = await res.json();
    return (data);
};

function setYearTotal(purchases, incomes) {
    let totalPurchases = 0;
    let totalIncomes = 0;
    purchases.forEach(element => {
        totalPurchases += element.amount;
    });
    incomes.forEach(element => {
        totalIncomes += element.amount;
    });
    const yearsTotal = (totalIncomes - totalPurchases).toFixed(2);
    document.querySelector(".yearSavings .data").innerHTML = yearsTotal;
};


async function mapPurchases(purchases) {
    let purchaseMap = new Map();
    purchases.forEach(element => {
        let date = new Date(element.purchaseDate).getMonth() + 1;
        if (purchaseMap.has(date)) {
            purchaseMap.set(date, purchaseMap.get(date) + element.amount);
        }
        else {
            purchaseMap.set(date, element.amount);
        }
    });
    return (purchaseMap);
};

async function mapIncomes(incomes) {
    let incomeMap = new Map();

    incomes.forEach(element => {
        let date = new Date(element.depositDate).getMonth() + 1;
        if (incomeMap.has(date)) {
            incomeMap.set(date, incomeMap.get(date) + element.amount);
        }
        else {
            incomeMap.set(date, element.amount);
        }
    });
    return (incomeMap);
};

async function monthToMonthGraph(purchases, incomes) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let purchaseMap = await mapPurchases(purchases);
    let incomeMap = await mapIncomes(incomes);
    let monthToMonth = [];

    for (let i = 1; i <= new Date().getMonth() + 1; i++) {
        monthToMonth.push({x: monthNames[i - 1],
            y : ((incomeMap.has(i) ? incomeMap.get(i) : 0) - (purchaseMap.has(i) ? purchaseMap.get(i) : 0))
        });
    };
    JSC.chart("chartDiv", {
        xAxis_label_text: "Month",
        yAxis_label_text: "$",
        zAxis_label_text: "Savings",
        series: [{points: monthToMonth}, {type: ""}],
    });
    console.log(monthToMonth);
}

async function overView() {
    let purchases = await getData("/getYearPurchases");
    let incomes = await getData("/getYearIncomes");
    setYearTotal(purchases, incomes);
    monthToMonthGraph(purchases, incomes);
}

overView();