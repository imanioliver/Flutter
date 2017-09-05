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
    },
    {order: [['createdAt', 'DESC']]})
    .then(function(data) {
        // console.log(data);
        // let currentUser;
        // console.log('Message id here for all: ', Message.userId);
        // console.log("everything on Message: ", data);
        // console.log('the current user: ', req.user.id);
        // console.log("FIRST CURRENTUSER: " , currentUser);
        // console.log("evaluate message and user id", req.user.id===Message.dataValues.userId);
        // if (req.user.id===Message.dataValues.userId){
        //     currentUser = true,
        // console.log(currentUser);
        // res.render("home", {messages:res.locals.getMessages(), currentUser:currentUser})
        //
        // } else {
        //     currentUser = false,
        res.render("home", {messages: res.locals.getMessages(), allMessages:data})
        // }


        // );
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

        res.send("error")
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
        // console.log(data);
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

router.get("/message/:id", function(req, res){

    Message.findOne({
        where: {
            id: req.params.id
        }
    }, {
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
        console.log('the User id on the message: ', data.dataValues.userId);
        console.log("the current user's id is: ", req.user.id ) ;
        let bool = (data.dataValues.userId === req.user.id)

        res.render("oneMessage", {oneMessage:data, canDelete:bool})

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
        // console.log(data);
        res.redirect("/")
    });
})


module.exports = router;
