const User = require('../models/users');
const passport = require('passport');
const Review = require('../models/review');


module.exports.signin = function(req,res){
    return res.render('signin',{
        title: "Signin",
        message: ""
    });
}

module.exports.createSession = async function(req,res){
    const finduser = await User.findOne({email: req.body.email});
    if(finduser){
        res.redirect('/?user=' + finduser.id);
    }
        // return res.render('home',{
        //     title: "welcome",
        //     name: finduser.name,
        //     userType: finduser.userType
        // });
}

module.exports.register = async function(req,res){
    return res.render('register',{
        title: "register",
        message: ""
    });
}

module.exports.createUser = async function(req,res){
    // checking iff existing user

    const findUser = await User.findOne({email: req.body.email});

    if(findUser){
        return res.render('register', {
            title: "register",
            message: "false"
        })
    }else{
        const userResult = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            userType: "employee"
        });
    
        if(userResult){
            // console.log("User created")
            return res.render('signin',{
                title: "signin",
                message: "User Created. Please Login"
            });
        }else{
            console.log("Error", userResult);
        }
    }
}

module.exports.destroySession = function(req,res){
    req.logout(function(err){       // function given by passport.js to logout
        if(err){
            return res.redirect('/')
        }
        else{
            // console.log('loggedout')   
            return res.redirect('/');
        }
    });  
}

module.exports.deleteUser = async function(req,res){
    const user = await User.findById(req.params.id)
    .populate({path: 'reviewAssigned'})
    if(user.reviewAssigned.length == 0){
        console.log('no reviews Assigned');
        
        // deleting reviews from reviwee's doc
        const review = await Review.find({reviewer: user._id})

        for(rev in review){
            const reviewee =await User.findOneAndUpdate({ review: review[rev]._id }, {
                $pull: {
                    review: review[rev]._id
                }
            },{ multi: true });
        }

        //deleting actual review 
        const reviewDelete = await Review.deleteMany({reviewer: user._id})
        
        // deleting from the reviwer's doc
        const deleteUser = await User.deleteOne({_id: user._id})
    }else{
        
        // deleting review from reviwee's doc entry then review doc and the reviwers's doc entry
        for(rev in user.reviewAssigned){
             // deleting review entry from reviwee's document
            const reviewee =await User.findOneAndUpdate({ review: user.reviewAssigned[rev]._id }, {
            $pull: {
                review: user.reviewAssigned[rev]._id
            }
        },{ multi: true });

            // deleting review from review doc
            const review = await Review.deleteOne({_id: user.reviewAssigned[rev].id})

            //deleting from reviewAssigned from reviewers table i.e current user
            const reviewer =await User.findOneAndUpdate({ reviewAssigned: user.reviewAssigned[rev]._id }, {
                $pull: {
                    reviewAssigned: user.reviewAssigned[rev]._id
                }
            },{ multi: true });

            // deleting user 
            const deleteUser = await User.deleteOne({_id: user._id})
         }
    }


    return res.redirect('back');
}

module.exports.adminReviews = async function(req,res){
    const findUser = await User.findById(req.params.user);
    findUser.userType = "employee";
    // console.log(findUser);
    const employee= await User.findById(findUser._id)
        .populate({path: 'reviewAssigned',
        populate: {
            path: 'reviewee', model: 'User'
        }
        });

    return res.render('home', {
        title: "Admin",
        user: findUser,
        reviewsPending: employee.reviewAssigned
    });
}

module.exports.update = async function(req,res){
    const user = await User.findById(req.params.id);
    return res.render('employee_update',{
        title: "Employee_details",
        user: user
    })
}

module.exports.changeDetails = async function(req,res){
    // console.log(req.body);
    const user = await User.findById(req.body._id)
    var password= user.password;
    if(!req.body.password == ""){
        password = req.body.password
    }
    console.log(req.body)
    var userType= user.userType
    if(req.body.admin){
        userType = "admin";
    }

    const filter = { _id: user._id };

    const options = { upsert: false };

    const updateDoc = {
        $set: {
            name: req.body.name,
            email: req.body.email,
            userType: userType,
            password: password
        },
    };

    try {
        const updatedUser = await User.findOneAndUpdate(filter, updateDoc, options);
    } catch (error) {
        console.log(error);
    }
    res.redirect('back');
}