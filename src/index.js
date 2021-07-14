require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");


const sqlconnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

sqlconnection.connect();



// what services do I need to get form the sever?

app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// app.get("/", (req, res) => {
//     sqlconnection.query('SELECT * FROM budgets', (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         res.send(result);
//     });
// });


app.get("/", (req, res) => {
    res.render("home");
});

// * this is my currently how i delete category items from the user facing page.
app.post("/deleteBudgetItm", (req, res) => {
    console.log("I'm going to delete something");
        console.log(req.body.deleteCategory);
        let sql = "DELETE FROM budgets WHERE id=?";
        sqlconnection.query(sql, req.body.deleteCategory, (err, result) => {
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
        sqlconnection.query(sql, (err, result) => {
            if (err) {
                return (console.log(err));
            }
            console.log(result);
            let ejsObj = {budgets: result}
            res.render("budgets", ejsObj);
        });
    })
    .post((req, res) => {
        // need category and budgeted
        console.log(req.body.category + " " + req.body.budgeted);
        let sql = "INSERT INTO budgets(category, budget) VALUES (\"" + req.body.category + "\"," + req.body.budgeted + ")";
        sqlconnection.query(sql, (err, result) => {
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
        sqlconnection.query(sql, [req.body.category, req.body.budgeted, req.body.categoryId], (err, result) => {
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
        sqlconnection.query(sql, req.body.deleteCategory, (err, result) => {
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