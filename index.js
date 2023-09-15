const express = require('express');
const app = express();

const port = process.env.PORT || 8000;
require('dotenv').config({ override: true })
var bodyParser = require('body-parser');
const expressSession = require('express-session')
const MemoryStore = require('memorystore')(expressSession)

const passport= require('passport');        //using passport.js for authentication
const {initializingPassport} = require('./config/passport-local-strategy');

const db = require('./config/mongoose');

app.use(expressSession({store: new MemoryStore({
    checkPeriod: 100000 // prune expired entries every 24h
  }),      
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false}
));

initializingPassport(passport);




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
