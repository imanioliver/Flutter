const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Message = require("../models/index").Message;
const User = require("../models/index").User;
const Like = require("../models/index").Like;

const passport = require('passport');

const isAuthenticated = function (req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/entry')
};

router.get("/", isAuthenticated, function(req, res) {
    // console.log(req.user);
    Message.findAll({
        include: [
            {
                model: User,
                as: "user"
            }
        ]
    })
    .then(function(messages) {
        console.log(messages);
        res.render("home", {messages: res.locals.getMessages(), allMessages:messages});
    })
    .catch(function(err) {
        console.log(err);
        res.redirect("/")
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/entry',
    failureFlash: true
}));

router.get("/entry", function(req, res) {
    res.render("entry");
});

router.post("/signup", function(req, res) {
    let username = req.body.username
    let displayname = req.body.displayname
    let password = req.body.passwordHash
    let name = req.body.name

    if (!username || !password) {
        req.flash('error', "Please, fill in all the fields.")
        res.redirect('/entry')
    }

    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(password, salt)

    let newUser = {
        username: username,
        displayname: displayname,
        name:name,
        salt: salt,
        passwordHash: hashedPassword
    }

    User.create(newUser).then(function() {
        res.redirect('/')
    }).catch(function(error) {
        req.flash('error', "Please, choose a different username.")
        res.redirect('/entry')
    });
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/create", isAuthenticated, function(req, res){
    res.render("create");
});

router.post("/create", function(req, res){
    // console.log(req.user);

    Message.create({
            title: req.body.title,
            text: req.body.text,
            userId: req.user.id
        })
    .then(function(data){
        // console.log(data);
      res.redirect("/");
    });
});


module.exports = router;
