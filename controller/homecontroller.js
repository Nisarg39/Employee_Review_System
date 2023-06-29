const User = require("../models/users");
const Review = require("../models/review");
const path = require("path");
const { model } = require("mongoose");

module.exports.home = async function (req, res) {
  const user = req.query.user;
  const findUser = await User.findOne({ _id: user });

  //if condtion for rendering content for admin and employee
  if(findUser.userType == 'admin'){
    const employees= await User.find({});

    let findemp = employees.filter((element) => {
        if (element.name != findUser.name) {
           return element;
        }
     })

    // console.log(findemp);

    res.render("home", {
        title: "welcome",
        user: findUser,
        employees: findemp
      });
  } else {
    // if normal employee
        const employee= await User.findById(findUser._id)
        .populate({path: 'reviewAssigned',
        populate: {
            path: 'reviewee', model: 'User'
        }
        });
        // console.log(employee.reviewAssigned[0]);


    res.render("home", {
        title: "welcome",
        user: findUser,
        reviewsPending: employee.reviewAssigned
      });
  }
  
};
