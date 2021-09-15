require('dotenv').config();
var LocalStrategy = require('passport-local').Strategy;
const mysql = require("./db/mysql.js").pool;

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });

      passport.deserializeUser(function(id, done) {
        mysql.query("SELECT * FROM users WHERE id=?;",[id], (err, user) => {
            done(err, user[0]);
        });
    });


passport.use(new LocalStrategy(
    {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
    function (req, email, password, done) {
        let sql = "SELECT * FROM users WHERE email=?;";
        mysql.query(sql, [email], (err, user) => {
            if (err) {
                return done(err)
            };
            if (!user.length) {
                return (done(null, false, req.flash("Incorrect Email.")));
            }
            if (user[0].password !== password) {
                return (done(null, false, req.flash("Incorrect Password.")));
            }
            console.log("returning " + user[0]);
            return (done(null, user[0]));
        });
    }
));
};