const express = require("express");
const User = require("../models/index").User;
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require('passport');

const isAuthenticated = function (req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
};


router.get("/", function(req, res) {
    res.render("home", {
        messages: res.locals.getMessages()
    });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
    res.render("entry");
});

router.post("/signup", function(req, res) {
    let username = req.body.username
    let displayname = req.body.displayname
    let password = req.body.passwordHash
    let name = req.body.name

    console.log(password);

    if (!username || !password) {
        req.flash('error', "Please, fill in all the fields.")
        res.redirect('entry')
    }

    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(password, salt)
    console.log(hashedPassword, "hashed");
    let newUser = {
        username: username,
        displayname: displayname,
        name:name,
        salt: salt,
        passwordHash: hashedPassword
    }

    User.create(newUser).then(function() {
        res.redirect('/')
        console.log(password);
    }).catch(function(error) {
        req.flash('error', "Please, choose a different username.")
        res.redirect('/signup')
    });
});

router.get("/user", isAuthenticated, function(req, res) {
    res.render("home", {username: ''});
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});



module.exports = router;
