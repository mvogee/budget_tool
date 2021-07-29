require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const mysql = require("./js/db/mysql.js").pool;
var helpers = require("./js/utils.js");


app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
// app.get("/", (req, res) => {
//     mysql.query('SELECT * FROM budgets', (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         res.send(result);
//     });
// });
var dt = new Date();
//! home page routes
app.get("/", (req, res) => {
    res.render("home");
});

 //! Income routes
app.get("/income", (req, res) => {
    let sql = "SELECT * FROM projectedIncome";
    mysql.query(sql, (err, result) => {
        if (err) {
            return (console.log(err));
        }
        ejsObj = {
            incomes: result,
            grossIncomeAll: helpers.getMonthlyGrossIncomeAll(result),
            netIncomeAll: helpers.getMonthlyNetIncomeAll(result),
            helpers: helpers
        };
        res.render("income", ejsObj);
    });
});


app.post("/projectedIncome", (req, res) => {
    console.log("adding item to projectedIncome");
    let sql = "INSERT INTO projectedIncome(incomeName, hourlyRate, taxRate, tithe, retirement) VALUES(?,?,?,?,?)";
    mysql.query(sql, [req.body.incomeName, req.body.hourlyRate, req.body.taxRate, req.body.tithe, req.body.retirement],
        (err, result) => {
            if (err) {
                return (console.log(err));
            }
            console.log(result);
        });
        res.redirect("income");
});
app.post("/deleteIncomeItm", (req, res) => {
    console.log("deleting income item");
    let sql = "DELETE FROM projectedIncome WHERE id=?";
    mysql.query(sql, req.body.deleteIncome, (err, result) => {
        if (err) {
            return (console.log(err));
        }
        console.log(result);
        res.redirect("/income");
    });
});



// ! thisMonth routes

// function renderThisMonth(date, res) {
//     date = new Date(date);
//     let monthStart = helpers.getMonthStart(date);
//     let monthEnd = helpers.getMonthEnd(date);
//     let sql = "SELECT * FROM monthIncome WHERE depositDate >= ? AND depositDate <= ?;";
//     sql += "SELECT * FROM monthSpending WHERE purchaseDate >= ? AND purchaseDate <= ?;";
//     sql += "SELECT * FROM budgets;";
//     mysql.query(sql, [monthStart, monthEnd, monthStart, monthEnd], (err, result) => {
//         if (err) {
//             return (console.log(err));
//         }
//         let ejsObj = {
//             deposits: result[0],
//             purchases: result[1],
//             budgets: result[2],
//             month: helpers.getMonthName(date),
//             date: helpers.getStandardDateFormat(date),
//             getCategoryName: helpers.getCategoryName,
//             formatDate: helpers.getStandardDateFormat
//         }
//         res.render("thisMonth", ejsObj);
//     });
// }

app.get("/thisMonth", (req, res) => {
     let monthStart = helpers.getMonthStart(dt);
     let monthEnd = helpers.getMonthEnd(dt);
     let sql = "SELECT * FROM monthIncome WHERE depositDate >= ? AND depositDate <= ?;";
     sql += "SELECT * FROM monthSpending WHERE purchaseDate >= ? AND purchaseDate <= ?;";
     sql += "SELECT * FROM budgets;";
     mysql.query(sql,[monthStart, monthEnd, monthStart, monthEnd], (err, result) => {
         if (err) {
            return (console.log(err));
        }
        let ejsObj = {
            today: new Date(),
            deposits: result[0],
            purchases: result[1],
            budgets: result[2],
            month: helpers.getMonthName(dt),
            date: helpers.getStandardDateFormat(dt),
            getCategoryName: helpers.getCategoryName,
            formatDate: helpers.getStandardDateFormat
        }
        res.render("thisMonth", ejsObj);
    });
});
app.post("/spendingItem", (req, res) => {
    let sql = "INSERT INTO monthSpending(itmDescription, ammount, category, purchaseDate) VALUES(?, ?, ?, ?)";
    mysql.query(sql, [req.body.itemName, req.body.amount, req.body.category, req.body.date], (err, result) => {
        if (err) {
            return (console.log(err));
        }
        console.log(result);
        res.redirect("/thisMonth");
    });
});
app.post("/incomeItem", (req, res) => {
    let sql = "INSERT INTO monthIncome(inDescription, ammount, depositDate) VALUES(?, ?, ?)";
    mysql.query(sql, [req.body.itemName, req.body.amount, req.body.date], (err, result) => {
        if (err) {
            return (console.log(err));
        }
        res.redirect("/thisMonth");
    });
});
app.post("/changeMonth", (req, res) => {
    dt = new Date(req.body.month + "-02");
    res.redirect("/thisMonth");
});

//! routes for budgets
app.post("/deleteBudgetItm", (req, res) => {
    console.log("I'm going to delete something");
        console.log(req.body.deleteCategory);
        let sql = "DELETE FROM budgets WHERE id=?";
        mysql.query(sql, req.body.deleteCategory, (err, result) => {
            if (err) {
                return console.log(err);
            }
            console.log(result);
        });
        res.redirect("/budgets");
});

app.route("/budgets")
    .get((req, res) => {
        console.log("get");
        let sql = "SELECT * FROM budgets";
        mysql.query(sql, (err, result) => {
            if (err) {
                return (console.log(err));
            }
            console.log(result);
            let ejsObj = {
                budgets: result,
                budgetTotal: helpers.addBudgetTotals(result)
            }
            res.render("budgets", ejsObj);
        });
    })
    .post((req, res) => {
        // need category and budgeted
        console.log(req.body.category + " " + req.body.budgeted);
        let sql = "INSERT INTO budgets(category, budget) VALUES (?, ?)";
        mysql.query(sql,[req.body.category, req.body.budgeted] , (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        });
        res.redirect("/budgets");
    })
    .patch((req, res) => {
        let sql = "UPDATE budgets SET category = ?, budget = ? WHERE id= ?";
        mysql.query(sql, [req.body.category, req.body.budgeted, req.body.categoryId], (err, result) => {
            if (err) {
                return console.log(err);
            }
            console.log("updated budget " + result);
            res.redirect("/budgets");
        });
    })
    .delete((req, res) => {
        console.log("I'm going to delete something");
        console.log(req.body.categoryId);
        let sql = "DELETE FROM budgets WHERE id=?";
        mysql.query(sql, req.body.deleteCategory, (err, result) => {
            if (err) {
                return console.log(err);
            }
            console.log(result);
        });
        res.redirect("/budgets");
    });

app.listen(port, () => {
    console.log("hello world");
});