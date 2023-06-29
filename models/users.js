const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    reviewAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    toJSON: { virtuals: true },
    timestamps: true
});

const User = mongoose.model('User', usersSchema);
module.exports  = User;