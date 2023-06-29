var mongoose = require('mongoose');
const User = require('../models/users');
const Review= require('../models/review');
const { json } = require('express');
const path = require('path');
const { populate } = require('../models/users');
const convertId = new mongoose.Types.ObjectId;

module.exports.view = async function(req,res) {
    // console.log(req.params.id);
    const reviewee = await User.findById(req.params.id);    //finding the reviewee from id which is passed in url parameters
    const employees= await User.find({});

    let empList = employees.filter((element) => {
        if (element.name != reviewee.name) {
           return element;
        }
     })
    
    return res.render('reviews', {
        title: 'reviews',
        empList: empList,
        reviewee: reviewee
    });
}

module.exports.assign = async function(req,res){

    const reviewer= req.body.reviewer;      //getting whole object rather then id
    const reviewee= req.body.reviewee;      //getting whole object rather then id

    //converting reviewee and reviewer id from string to object id datatype as we need to store their id in ObjectId datatype that we mentioned in reviews model Type 
    var revieweeId = new mongoose.Types.ObjectId(reviewee);
    var reviewerId = new mongoose.Types.ObjectId(reviewer);


    if(reviewer == ""){
        return res.redirect(404, 'back')
    }else{
          const reviewResult = await Review.create({
            review: "",
            status: false,
            reviewee: revieweeId,
            reviewer: reviewerId
          });
         // below code if i want to populate reviewer and reviewee in reviews model
        const reviews = await Review.findById(reviewResult.id)
        //   .populate({path: "reviewee", model: "User"})
        //   .populate({path: "reviewer", model: "User"})

        //updating reviewee's review array
        if(reviews){
            const filter = { _id: revieweeId };
            const options = { upsert: false };  //set it to false other wise it will create a new blank user with reviews in it
            const updateDoc = {
                $push: {
                  review: reviews
                },
              };
              try {
                const result = await User.updateOne(filter, updateDoc, options);
              } catch (error) {
                console.log('error', result)
              }   
        }

        //updating reviewer's review array
        if(reviews){
            const filter = { _id: reviewerId };
            const options = { upsert: false };  //set it to false other wise it will create a new blank user with reviews in it
            const updateDoc = {
                $push: {
                    reviewAssigned: reviews
                },
              };
              try {
                const result = await User.updateOne(filter, updateDoc, options);
              } catch (error) {
                console.log('error', result)
              }   
        }


          return res.redirect('back');
    }
    
}

module.exports.revieweeList = async function(req,res){
    // console.log(req.params.id)
    const reviewee= await User.findById(req.params.id)
    .populate({path: "review",
    populate: [{
        path: "reviewer" , model: "User"
    }]
    });

    reviewee.save();
    // for traversing reviweers from reviewee's review and the from review to reviwee.review array
    // for(reviewer in reviewee.review){
    //     console.log(reviewee.review[reviewer].reviewer.name);
    // }
    return res.render('revieweeList', {
        title: 'reviewsList',
        user: reviewee
    })
}


module.exports.deleteReview = async function(req,res){
    const review = await Review.findById(req.params.id)
    const reviewerUser = await User.findById(review.reviewer);


    // deleting from reviewer's reviewAssigned array
    try {
        const reviewer =await User.findOneAndUpdate({ reviewAssigned: reviewerUser.reviewAssigned[rev]._id }, {
            $pull: {
                reviewAssigned: reviewerUser.reviewAssigned[rev]._id
            }
        },{ multi: true });
    } catch (error) {
        console.log('error', error)
    }

    //deleting from reviewee's doc
    try {
        const reviewee =await User.findOneAndUpdate({ review: review._id }, {
            $pull: {
                review: review._id
            }
        },{ multi: true });
    } catch (error) {
        console.log('error')
    }

    //deleting from review doc
    const reviewDelete = await Review.deleteOne({_id: review._id});
    
    return res.redirect('back');
}


module.exports.reviewed = async function(req,res){
    //updating review in reviews model
    const filter = { _id: req.body.review_id };
    const options = { upsert: false }; //set it to false other wise it will create a new blank user with reviews in it
    const updateDoc = {
    $set: {
        review: req.body.review,
        status: true,
        },
    };
    const result = await Review.updateOne(filter, updateDoc, options);

    if (!result) {
        console.log("failed", result);
    }

    //removing review from reviewAssigned array from reviewers db
    const user=await User.findOneAndUpdate({ _id: req.body.user }, {
        $pull: {
            reviewAssigned: req.body.review_id
        }
    },{ multi: true });
    
    if(user){
        console.log('Deleted', user)
    }else{
        console.log('error', user)
    }

    return res.redirect('back');
}