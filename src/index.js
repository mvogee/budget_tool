require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const mysql = require("./js/db/mysql.js").pool;
var utils = require("./js/utils.js");


app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var dt = new Date(); // ~ dt is used to save state of chosen month view in thisMonth route
//! home page routes
app.get("/", (req, res) => {
    res.render("home");
});

 //! Income routes
app.route("/income")
.get((req, res) => {
    let sql = "SELECT * FROM projectedIncome";
    mysql.query(sql, (err, result) => {
        if (err) {
            return (console.log(err));
        }
        ejsObj = {
            incomes: result,
            grossIncomeAll: utils.getMonthlyGrossIncomeAll(result),
            netIncomeAll: utils.getMonthlyNetIncomeAll(result),
            utils: utils
        };
        res.render("income", ejsObj);
    });
})
.post((req, res) => {
    console.log("adding item to projectedIncome");
    let sql = "INSERT INTO projectedIncome(incomeName, hourlyRate, taxRate, tithe, retirement, hoursPerWeek) VALUES(?,?,?,?,?,?)";
    mysql.query(sql, [req.body.incomeName, req.body.hourlyRate, req.body.taxRate, req.body.tithe, req.body.retirement, req.body.hoursPerWeek],
        (err, result) => {
            if (err) {
                return (console.log(err));
            }
            console.log(result);
        });
        res.redirect("/income");
})
.delete((req, res) => {
    console.log("deleting income item");
    let sql = "DELETE FROM projectedIncome WHERE id=?";
    mysql.query(sql, req.body.deleteIncome, (err, result) => {
        if (err) {
            return (console.log(err));
        }
        console.log(result);
        res.redirect("/income");
    });
})
.patch((req, res) => {
    console.log("updating income item");
    let sql = "UPDATE projectedIncome SET incomeName=?, hourlyRate=?, taxRate=?, tithe=?, retirement=?, hoursPerWeek=? WHERE id=?";
    mysql.query(sql, [req.body.incomeName, req.body.hourlyRate, req.body.taxRate, req.body.tithe, req.body.retirement, req.body.hoursPerWeek, req.body.itmId],
        (err, result) => {
            if (err) {
            console.log(err)
            }
            console.log(result);
            res.redirect("/income");
        });
});


// ! thisMonth routes

app.get("/thisMonth", (req, res) => {
     let monthStart = utils.getMonthStart(dt);
     let monthEnd = utils.getMonthEnd(dt);
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
            month: utils.getMonthName(dt),
            date: utils.getStandardDateFormat(dt),
            getCategoryName: utils.getCategoryName,
            formatDate: utils.getStandardDateFormat
        }
        res.render("thisMonth", ejsObj);
    });
});
app.post("/spendingItem", (req, res) => {
    let sql = "INSERT INTO monthSpending(itmDescription, amount, category, purchaseDate) VALUES(?, ?, ?, ?)";
    mysql.query(sql, [req.body.itemName, req.body.amount, req.body.category, req.body.date], (err, result) => {
        if (err) {
            return (console.log(err));
        }
        console.log(result);
        res.redirect("/thisMonth");
    });
});
app.post("/spendingItemUpdate", (req, res) => {
    let sql = "UPDATE monthSpending SET itmDescription=?, amount=?, category=?, purchaseDate=?  WHERE id=?";
    mysql.query(sql, [req.body.itemName, req.body.amount, req.body.category ,req.body.date , req.body.itmId], (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.redirect("/thisMonth");
    });
});
app.post("/depositItem", (req, res) => {
    let sql = "INSERT INTO monthIncome(inDescription, amount, depositDate) VALUES(?, ?, ?)";
    mysql.query(sql, [req.body.itemName, req.body.amount, req.body.date], (err, result) => {
        if (err) {
            return (console.log(err));
        }
        res.redirect("/thisMonth");
    });
});
app.post("/updateDepositItem", (req, res) => {
    let sql = "UPDATE monthIncome SET inDescription=?, amount=?, depositDate=? WHERE id=?";
    mysql.query(sql, [req.body.itemName, req.body.amount, req.body.date, req.body.itmId], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/thisMonth");
    });
});

app.post("/changeMonth", (req, res) => {
    dt = new Date(req.body.month + "-02");
    res.redirect("/thisMonth");
});
app.post("/deleteSpendingItm", (req, res) => {
    console.log("deleting income item");
    let sql = "DELETE FROM monthSpending WHERE id=?";
    mysql.query(sql, req.body.deleteSpendingItm ,(err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.redirect("/thisMonth");
    });
});
app.post("/deleteMonthIncomeItm", (req, res) => {
    let sql = "DELETE FROM monthIncome WHERE id=?";
    console.log(req.body.deleteIncomeItm);
    mysql.query(sql, req.body.deleteIncomeItm, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.redirect("/thisMonth");
    });
});

//! routes for budgets
// app.post("/deleteBudgetItm", (req, res) => {
//     console.log("I'm going to delete something");
//         console.log(req.body.deleteCategory);
//         let sql = "DELETE FROM budgets WHERE id=?";
//         mysql.query(sql, req.body.deleteCategory, (err, result) => {
//             if (err) {
//                 return console.log(err);
//             }
//             console.log(result);
//         });
//         res.redirect("/budgets");
// });
//* now handeled through the DELETE route below

app.route("/budgets")
    .get(async (req, res) => {
        let sql = "SELECT * FROM budgets;";
        sql += "SELECT * FROM projectedIncome;";

        mysql.query(sql, (err, result) => {
            if (err) {
                return (console.log(err));
            }
            let ejsObj = {
                budgets: result[0],
                budgetTotal: utils.addBudgetTotals(result[0]),
                projectedIncome: utils.getMonthlyNetIncomeAll(result[1])
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
            res.redirect("/budgets");
        });
    })
    .patch((req, res) => {
        let sql = "UPDATE budgets SET category = ?, budget = ? WHERE id= ?";
        mysql.query(sql, [req.body.category, req.body.budgeted, req.body.itemId], (err, result) => {
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

    app.post("/updateBudgetItm", (req, res) => {
        let sql = "UPDATE budgets SET category=?, budget=? WHERE id=?";
        mysql.query(sql, [req.body.category, req.body.budgeted, req.body.id], (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
            res.redirect("/budgets");
        });
    });
app.listen(port, () => {
    console.log("hello world");
});