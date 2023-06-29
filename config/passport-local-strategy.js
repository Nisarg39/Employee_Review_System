const LocalStrategy= require('passport-local').Strategy;    // using local strategy from passport-local package

const User= require('../models/users');     // importing user database from model 

exports.initializingPassport = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(username, password, done){
    try {
      const user = await User.findOne ({email: username});
      if(!user) return done(null, false);
      if(user.password !== password) return done(null, false);
      return done(null, user);

    } catch (error) {
      return done(error, false);
    }
  }));


  passport.serializeUser((user,done) => {
    done(null, user.id)
  });

  passport.deserializeUser(async(id, done) => {

    try {
      const user= await User.findById(id);
      done (null, user);
    } catch (error) {
      
    }
  })


  passport.checkAuthentication = function(req, res, next){
    //if the user is signed in , then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }
  
    //if the user is not signed in
    return res.redirect('/users/signin');
  }
  
  passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from session cookie and we are just sending it to locals for the views
        res.locals.user = req.user;
    }
  
    next();
  }


};

