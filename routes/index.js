const express = require('express');
const passport = require('passport');

const route = express.Router();


const AdminController = require('../controllers/admin');

route.get('/',AdminController.loginPage);

route.get('/logout', function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log("somethign wrong");
            return false;
        }
        return res.redirect('/');
    })
});

route.post('/checklogin',passport.authenticate('local',{failureRedirect :'/'}),AdminController.checkLogin);

route.post('/checklogin',AdminController.checkLogin);
route.get('/dashboard',passport.checkAuthentication,AdminController.dashboard);

route.get('/view_admin',passport.checkAuthentication, AdminController.viewAdmin);

route.get('/add_admin',passport.checkAuthentication,AdminController.addAdmin);

route.post('/insertAdminRecord', AdminController.insertAdminRecord);

route.get('/changePassword',passport.checkAuthentication, AdminController.changepassword);

route.post('/checkChangePass', passport.checkAuthentication,AdminController.checkChangepass);


//forgot password routings
route.get('/forgotpass', AdminController.forgotpass);
route.post('/recoverEmail',AdminController.recoverEmail);
route.get('/checkOtp', AdminController.checkOtp);
route.post('/checkOTPData', AdminController.checkOTPData);
route.get('/recoverPassword',AdminController.recoverPassword);
route.post('/recoverPass',AdminController.recoverPass);
//end routings

route.use('/category',require('./category'));
route.use('/subcategory', require('./subcategory'));

module.exports = route;