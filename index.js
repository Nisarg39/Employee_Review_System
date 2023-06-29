const express = require('express');
const app = express();
const port = 8000;
var bodyParser = require('body-parser');
const expressSession = require('express-session')

const passport= require('passport');        //using passport.js for authentication
const {initializingPassport} = require('./config/passport-local-strategy');

const db = require('./config/mongoose');

initializingPassport(passport);


app.use(expressSession({        //always use express session before passport initilization
    secret: "nisarg",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);
app.use(express.urlencoded({ extended: true }));
app.use('/',require('./routes'))
app.use(express.static('./assets')) // for getting static
app.set('layout extractStyles',true);
app.set('layout extractScripts',true)
app.set('view engine','ejs');
app.set('views','./views');




app.listen(port, function(err){
    if(err){
        console.log(`error in running the ${port}`)
        return;
    }
    console.log(`Server is running @ ${port}`)
});
