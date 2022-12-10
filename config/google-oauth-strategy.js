const passport = require('passport');
const { deleteOne } = require('../models/admin');

const googleStrategy= require('passport-google-oauth20').Strategy;

const crypto = require('crypto');

const Admin = require('../models/admin');

passport.use(new googleStrategy({
    clientID : "110825608672-66n0kjilrr21iood6j4ai9teb0m86f4p.apps.googleusercontent.com",
    clientSecret : "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",
    callbackURL : "http://localhost:9000/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    Admin.findOne({email : profile.emails[0].value}).exec(function(err,user){
       if(err){
        console.log(err);
        return false;
       }
       if(user){
        return done(null,user);
       }
       else{
          Admin.create({
            name : profile.displayName,
            email : profile.emails[0].value,
            password : crypto.randomBytes(5).toString('hex')
          }, function(err,user){
            if(err){
              console.log(err);
              return false;
            }
            return done(null, user);
          })
       }
    })
  }
));



module.exports = passport;