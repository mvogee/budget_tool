//! route is not set up for this yet
async function getYearData(route) {
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


async function doStuff() {
    let purchases = await getYearData("/getYearPurchases");
    let incomes = await getYearData("/getYearIncomes");
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
    console.log(purchases);
    console.log(incomes);
    
}

doStuff();