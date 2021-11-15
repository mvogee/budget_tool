const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utils = require("./js/utils.js");
const passport = require('passport');
const mysql = require("./js/db/mysql.js").pool;
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const cipher = require("./js/cipher.js");

app = express();
const port = 3000;

require("./js/passport_config")(passport);

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set("trust proxy", 1);
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: 'strict'}
    })
    );
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// * --- END BOILERPLATE ----- *

//! home page routes
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login",
        passport.authenticate('local', {
            successRedirect: '/overview',
            failureRedirect: '/login',
            failurFlash: true
             }),
        (req, res) => {
            res.redirect("/overview");
        });
app.get("/createAcc", (req, res) => {
    res.render("createAcc");
});
app.post("/createAcc", (req, res) => {
    const pw = req.body.password;
    const email = req.body.email;
    const userName = req.body.userName;
    let sql = "SELECT email FROM users WHERE email=?";
    mysql.query(sql, [email], (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
            return (err);
        }
        if (result[0]) {
            console.log("email already used for another account");
            res.redirect('/');
        }
        else {
            let insertSql = "INSERT INTO users(email, password, username) VALUES(?,?,?)";
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return (err);
                }
                bcrypt.hash(pw, salt, (err, hash) => {
                    if (err) {
                        return (err);
                    }
                    mysql.query(insertSql, [email, hash, userName], (error, created) => {
                        console.log("acount created");
                        if (error) {
                            console.log(error);
                            return (error);
                        }
                        console.log(created);
                        res.redirect("/login");
                    });
                });
            });
        }
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

//* EVERYTHING BELOW HERE SHOULD REQUIRE AUTH
//! Overview routes
app.route("/overview")
.get(async (req, res) => {
    if (req.isAuthenticated()) {
        let critItms = await utils.getCritItms(mysql, req.user.id)
        .catch(reason => {
            console.log("reject: " + reason);
            res.redirect("/login");
        });
        let ejsObj = {
            critBudgetItems: critItms,
            userName: req.user.username
        }
        res.render("overview", ejsObj);
    }
    else {
        res.redirect("/login");
    }
});
app.get("/getYearPurchases", (req, res) => {
    if (req.isAuthenticated()) {
        const year = new Date().getFullYear();
        const endYear = year + "-12-31";
        const begYear = year + "-01-01";
        let sql = "SELECT amount, purchaseDate FROM monthSpending WHERE purchaseDate >= ? AND purchaseDate <= ? AND userId=?;";
        mysql.query(sql, [begYear, endYear, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            result.forEach(amount => {
                amount.amount = parseFloat(cipher.decryptString(amount.amount, process.env.KEY));
            });
            res.send(result);
        });
    }
    else {
        res.redirect("/login");
    }
});
app.get("/getYearIncomes", (req, res) => {
    if (req.isAuthenticated()) {
        const year = new Date().getFullYear();
        const endYear = year + "-12-31";
        const begYear = year + "-01-01";
        let sql = "SELECT amount, depositDate FROM monthIncome WHERE depositDate >= ? AND depositDate <= ? AND userId=?;";
        mysql.query(sql, [begYear, endYear, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            result.forEach(amount => {
                amount.amount = parseFloat(cipher.decryptString(amount.amount, process.env.KEY));
            });
            res.send(result);
        });
    }
    else {
        res.redirect("/login");
    }
});

 //! Income routes
app.route("/income")
.get((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "SELECT * FROM projectedIncome WHERE userId=?;";
        mysql.query(sql, req.user.id, (err, result) => {
            if (err) {
                return (console.log(err));
            }
            ejsObj = {
                incomes: result,
                grossIncomeAll: utils.getMonthlyGrossIncomeAll(result),
                netIncomeAll: utils.getMonthlyNetIncomeAll(result),
                utils: utils,
                userName: req.user.username
            };
            res.render("income", ejsObj);
        });
    }
    else {
        res.redirect("/login");
    }
})
.post((req, res) => {
    if (req.isAuthenticated()) {
        console.log("adding item to projectedIncome");
        let sql = "INSERT INTO projectedIncome(incomeName, hourlyRate, taxRate, retirement, hoursPerWeek, userId) VALUES(?,?,?,?,?,?);";
        mysql.query(sql, [req.body.incomeName, req.body.hourlyRate, (req.body.taxRate / 100), (req.body.retirement / 100), req.body.hoursPerWeek, req.user.id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    res.send(result);
                }
        });
    }
    else {
        res.redirect("/login");
    }
})
.delete((req, res) => {
    if (req.isAuthenticated()) {
        console.log("deleting income item");
        let sql = "DELETE FROM projectedIncome WHERE id=? AND userId=?;";
        mysql.query(sql, [req.body.deleteIncome, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.patch((req, res) => {
    if (req.isAuthenticated()) {
        console.log("updating income item");
        let sql = "UPDATE projectedIncome SET incomeName=?, hourlyRate=?, taxRate=?, retirement=?, hoursPerWeek=? WHERE id=? AND userId=?;";
        mysql.query(sql, [req.body.incomeName, req.body.hourlyRate, (req.body.taxRate / 100), (req.body.retirement / 100), req.body.hoursPerWeek, req.body.itmId, req.user.id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    res.send(result);
                }
            });
    }
    else {
        res.redirect("/login");
    }
});


// ! thisMonth routes

app.route("/thisMonth/:month?")
.get((req, res) => {
    if (req.isAuthenticated()) {
        let dt = new Date();
        if (req.params.month) {
            dt = new Date(req.params.month + "-02");
        }

        let monthStart = utils.getMonthStart(dt);
        let monthEnd = utils.getMonthEnd(dt);
        let sql = "SELECT * FROM monthIncome WHERE depositDate >= ? AND depositDate <= ? AND userId=?;";
        sql += "SELECT * FROM monthSpending WHERE purchaseDate >= ? AND purchaseDate <= ? AND userId=?;";
        sql += "SELECT * FROM budgets WHERE userId=?;";
        mysql.query(sql,[monthStart, monthEnd, req.user.id, monthStart, monthEnd, req.user.id, req.user.id], (err, result) => {
            if (err) {
                return (console.log(err));
            }
            result[0].forEach(item => {
                item.inDescription = cipher.decryptString(item.inDescription, process.env.KEY);
                item.amount = cipher.decryptString(item.amount, process.env.KEY);
            });
            result[1].forEach(item => {
                item.itmDescription = cipher.decryptString(item.itmDescription, process.env.KEY);
                item.amount = cipher.decryptString(item.amount, process.env.KEY);
            });
            let ejsObj = {
                today: new Date(),
                deposits: result[0],
                purchases: result[1],
                budgets: result[2],
                month: utils.getMonthName(dt),
                date: utils.getStandardDateFormat(dt),
                getCategoryName: utils.getCategoryName,
                formatDate: utils.getStandardDateFormat,
                userName: req.user.username
            }
            res.render("thisMonth", ejsObj);
        });
    }
    else {
        res.redirect("/login");
    }
});
app.route("/spendingItem")
.post((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "INSERT INTO monthSpending(itmDescription, amount, category, purchaseDate, userId) VALUES(?, ?, ?, ?, ?);";
        let itemName = cipher.encryptString(req.body.itemName, process.env.KEY);
        let amount = cipher.encryptString(req.body.amount, process.env.KEY);
        mysql.query(sql, [itemName, amount, req.body.category, req.body.date, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.delete((req, res) => {
    if (req.isAuthenticated()) {
        console.log("deleting income item");
        let sql = "DELETE FROM monthSpending WHERE id=? AND userId=?;";
        mysql.query(sql, [req.body.deleteSpendingItm, req.user.id] ,(err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                console.log(result);
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.patch((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "UPDATE monthSpending SET itmDescription=?, amount=?, category=?, purchaseDate=?  WHERE id=? AND userId=?;";
        let itemName = cipher.encryptString(req.body.itemName, process.env.KEY);
        let amount = cipher.encryptString(req.body.amount, process.env.KEY);
        mysql.query(sql, [itemName, amount, req.body.category ,req.body.date , req.body.itmId, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.post("/queryMonthSpendCategory", (req, res) => {
    if (req.isAuthenticated()) {
        let monthStart;
        let monthEnd;
        if (req.body.date) {
            monthStart = utils.getMonthStart(new Date(req.body.date + "-02"));
            monthEnd = utils.getMonthEnd(new Date(req.body.date + "-02"));
        }
        else {
            monthStart = utils.getMonthStart(new Date());
            monthEnd = utils.getMonthEnd(new Date());
        }
        let sql = "SELECT amount from monthSpending WHERE category=? AND purchaseDate >= ? AND purchaseDate <= ? AND userId=?;";
        mysql.query(sql, [req.body.categoryId, monthStart, monthEnd, req.user.id], (err, result) => {
            let total = 0;
            result.forEach(element => {
                element.amount = cipher.decryptString(element.amount, process.env.KEY);
                total += parseFloat(element.amount);
            });
            res.send({total: total});
        });
    }
    else {
        res.redirect("/login");
    }
})

app.route("/depositItem")
.post((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "INSERT INTO monthIncome(inDescription, amount, depositDate, userId) VALUES(?, ?, ?, ?);";
        let itemName = cipher.encryptString(req.body.itemName, process.env.KEY);
        let amount = cipher.encryptString(req.body.amount, process.env.KEY);
        mysql.query(sql, [itemName, amount, req.body.date, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.patch((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "UPDATE monthIncome SET inDescription=?, amount=?, depositDate=? WHERE id=? AND userId=?;";
        let itemName = cipher.encryptString(req.body.itemName, process.env.KEY);
        let amount = cipher.encryptString(req.body.amount, process.env.KEY);
        mysql.query(sql, [itemName, amount, req.body.date, req.body.itmId, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.delete((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "DELETE FROM monthIncome WHERE id=? AND userId=?";
        mysql.query(sql, [req.body.deleteIncomeItm, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.get("/getMonthIncome", (req, res) => {
    if (req.isAuthenticated()) {
        let sql = "SELECT * FROM monthIncome WHERE depositDate >= ? AND depositDate <= ? AND userId=?;";
        let monthStart = utils.getMonthStart(new Date());
        let monthEnd = utils.getMonthEnd(new Date());
        mysql.query(sql, [monthStart, monthEnd, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            result.forEach(item => {
                item.inDescription = cipher.decryptString(item.inDescription, process.env.KEY);
                item.amount = cipher.decryptString(item.amount, process.env.KEY);
            });
            res.send(result);
        });
    }
    else {
        res.redirect("/login");
    }
});

//! routes for budgets

app.route("/budgets")
.get((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "SELECT * FROM budgets WHERE userId=?;";
        sql += "SELECT * FROM projectedIncome WHERE userId=?;";
        mysql.query(sql,[req.user.id, req.user.id], (err, result) => {
            if (err) {
            return (console.log(err));
            }
            let ejsObj = {
                budgets: result[0],
                budgetTotal: utils.addBudgetTotals(result[0]),
                projectedIncome: utils.getMonthlyNetIncomeAll(result[1]),
                userName: req.user.username
            }
            res.render("budgets", ejsObj);
        });
    }
    else {
        res.redirect("/login");
    }
})
.post((req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.body.category + " " + req.body.budgeted);
        let sql = "INSERT INTO budgets(category, budget, userId) VALUES (?, ?, ?);";
        mysql.query(sql,[req.body.category, req.body.budgeted, req.user.id] , (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.patch((req, res) => {
    if (req.isAuthenticated()) {
        let sql = "UPDATE budgets SET category = ?, budget = ? WHERE id= ? AND userId=?;";
        mysql.query(sql, [req.body.category, req.body.budgeted, req.body.itemId, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
})
.delete((req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.body.categoryId);
        let sql = "DELETE FROM budgets WHERE id=? AND userId=?;";
        mysql.query(sql, [req.body.deleteCategory, req.user.id], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    }
    else {
        res.redirect("/login");
    }
});

app.get("/getBudgetItems", (req, res) => {
    if (req.isAuthenticated()) {
        let sql = "SELECT id, category FROM budgets WHERE userId=?;";
        mysql.query(sql, req.user.id , (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.send(result);
        });
    }
    else {
        res.redirect("/login");
    }
});

app.listen(port, () => {
    console.log("hello world");
});