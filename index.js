const exp = require('constants');
const express = require('express');

const port = 8082;
const path = require('path');

const app = express();
const db = require('./config/mongoose');
const cookieParser =require('cookie-parser');

//authentication 
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'assets')));

const flash = require('connect-flash');
const customM = require('./config/customM');

app.use(express.urlencoded());

app.use(session({
    name : "batch",
    secret : "code",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 3600000    
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customM.setFlash);

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log("something wrong");
        return false;
    }
    console.log(`server is running on port:${port}`)
})