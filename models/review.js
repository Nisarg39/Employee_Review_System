const mongoose = require('mongoose');
const User = require('./users');
const reviewSchema = new mongoose.Schema({
    review: {
        type:String
    },
    status: {
        type: Boolean
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
     },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true,
    toJSON: {virtuals: true}
})

const Review = mongoose.model('Review', reviewSchema);
module.exports  = Review;