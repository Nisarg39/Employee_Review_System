const express= require ('express');
const router = express.Router();
const passport = require ('passport');

const users_Controller = require('../controller/users_controller');

router.get('/signin', users_Controller.signin)

router.post('/createsession', passport.authenticate("local", {failureRedirect: '/users/signin'}) ,users_Controller.createSession);

router.get('/register', users_Controller.register);

router.post('/create-user', users_Controller.createUser);

router.get('/signout', users_Controller.destroySession);

router.get('/delete/:id', passport.checkAuthentication ,users_Controller.deleteUser);

router.get('/adminpending/:user', passport.checkAuthentication, users_Controller.adminReviews);

router.get('/update/:id', passport.checkAuthentication, users_Controller.update);

router.post('/updateuser', passport.checkAuthentication, users_Controller.changeDetails)

router.use('/review', require('./review'));

module.exports = router;