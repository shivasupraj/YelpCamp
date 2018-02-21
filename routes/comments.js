var express = require("express")
var router = express.Router({mergeParams : true}) 
var Campground  = require("../models/campground"),
    Comment     = require("../models/comment")
    
// ====================
// COMMENTS ROUTES
// ====================

//Comments new
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//Comments add
router.post("", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id
               comment.author.username = req.user.username
               comment.save()
               campground.comments.push(comment._id)
               campground.save();
               console.log(comment)
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//Edit the comments route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", {campground_id : req.params.id, comment : foundComment})
        }
    })  
})
//Comments update route
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment){
        if (err) {
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


// Comments delete
router.delete("/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("pass")
        return next()
    }
    res.redirect("/login")
}

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back")
            }else{
                // is authorized to edit the comment?
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back")
    }
}


module.exports = router