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
            },
            {
                model:Like,
                as: "likes"
            }
        ]
    })
    .then(function(data) {
        // console.log(data);
        let currentUser = req.user.id;

        res.render("home", {messages: res.locals.getMessages(), allMessages:data

            // , messageID: message.dataValues.id
            // ,messageCount:
        }
        );
    })
    // .then(function(likeCount){
    //     Likes.findAll({
    //         where: {
    //             Message
    //         }
    //     })
    // })
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

    Message.findAll({
        include: [
            {
                model: User,
                as: "user"
            },
            {
                model:Like,
                as: "likes"
            }
        ]
    })

    .then(function(data){
        res.render("create", {allMessages:data})
    })
});

router.post("/create", function(req, res){
    // console.log(req.user);

    Message.create({
            text: req.body.text,
            userId: req.user.id
        })
    .then(function(data){
        console.log(data);
      res.redirect("/");
    });
});

router.post("/like/:id", function(req, res){

    let id= req.params.id;
    // console.log(id);
    // console.log(req.user.id);
    Like.create({
        userId: req.user.id,
        messageId: id
    })
    .then(function(data){
        // console.log(data);
        res.redirect("/");
    })


    //you should do a req.params.id to send to the like page
})

// router.post("/viewOne/:id", function(req, res){
//     let id= req.params.id;
//
//     Message.findById(req.params.id)
//
//     .then(function(data){
//
//         res.render("oneMessage");
//
//     })
//
// };

router.post("/viewOne/:id", function(req, res){
    let id= req.params.id;

    Message.findById(req.params.id)
    .then(function(data){

        res.render("oneMessage");

    })
});


router.get("/delete/:id", function (req, res){
    Like.destroy({
        where: {
            messageId: req.params.id
        }
    })
    .then(function(data){
        Message.destroy({
            where: {
                id: req.params.id
            }
        })
        console.log(data);
        res.redirect("/")
    });
})


module.exports = router;
