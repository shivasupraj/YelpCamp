var express = require("express")
var router = express.Router(),
    passport    = require("passport"),
    User         = require("../models/user")

router.get("/", function(req, res){
    res.render("landing");
});





//===================
// Auth routes
//===================

// show register form
router.get("/register", function(req, res) {
    res.render("register")
})
router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username})
   User.register(newUser, req.body.password, function(err, user){
       if (err) {
           console.log(err)
           return res.render("register")
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds")
       })
   })
})

//show login form
router.get("/login", function(req, res) {
    res.render("login")
})

router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res) {
    
})

//logout route
router.get("/logout", function(req, res) {
    req.logout()
    res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("pass")
        return next()
    }
    console.log('failed')
    res.redirect("/login")
}
module.exports = router