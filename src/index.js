const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("hello world");
});1

app.listen(port, () => {
    console.log("hello world");
});