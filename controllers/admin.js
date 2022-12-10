const Admin  = require('../models/Admin');

const nodemailer = require('nodemailer');

module.exports.loginPage = function(req,res){
    if(req.user)
    {
        return res.redirect('/dashboard');
    }
    return res.render('login');
}

module.exports.dashboard = function(req,res){
    return res.render('dashboard');
}

module.exports.viewAdmin = function(req,res){

    return res.render('view_admin');
}

module.exports.addAdmin = function(req,res){
    return res.render('add_admin');
}

module.exports.insertAdminRecord  = function(req,res){
    Admin.uploadedAvatar(req,res, function(err){
        if(req.file){
            var avatar = Admin.avatarPath+'/'+req.file.filename;
            var username = req.body.fname+" "+req.body.lname;
            Admin.create({
                name : username,
                email : req.body.email,
                password  : req.body.password,
                gender : req.body.gender,
                hobby : req.body.hobby,
                city : req.body.city,
                message: req.body.message,
                avatar : avatar
            }, function(err,record){
                if(err){
                    console.log("something wrong");
                    return false;
                }
                req.flash('success',"Record inserted successfully");
                return res.redirect('/add_admin');
            })
        }
    })    
}


module.exports.checkLogin = function(req,res){
    // console.log(req.body);
    req.flash('success','Login successfully');
    return res.redirect('/dashboard')
}


module.exports.changepassword = function(req,res){
    return res.render('changepass');
}

module.exports.checkChangepass = function(req,res){
    // console.log(req.body);
    // console.log(req.user.password);
    if(req.user.password === req.body.cupass){
        if(req.body.cupass != req.body.npass){
            if(req.body.npass == req.body.cpass){
                Admin.findByIdAndUpdate(req.user.id,{
                    password : req.body.npass
                }, function(err,userdata){
                    if(err){
                        console.log("something wrong");
                        return false;
                    }
                    return res.redirect('/dashboard');
                })
            }
            else{
                console.log("new and confirm are not match");
            }
        }
        else{
            console.log("current and new both are same");
        }
    }
    else{
        console.log("current and db password not match");
    }
}


module.exports.forgotpass = (req,res) =>{
    return res.render('forgotpass');
}   

module.exports.recoverEmail =  function   (req,res)  {
    Admin.findOne({email : req.body.email}, function(err,record){
        if(err){
            console.log("something wrong");
            return false;
        }
        // console.log(record);
        if(record){
            let otp = Math.ceil(Math.random() * 100000);
            res.cookie('setOTP',otp);
            res.cookie('userEmail',record.email);
            let transporter =  nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "f0456b82d1f8de",
                    pass: "02803f446ecda8" // generated ethereal password
                },
              });

              let info =  transporter.sendMail({
                from: 'piyush0101nakarani@gmail.com', // sender address
                to: record.email, // list of receivers
                subject: "Your OTP is Below:", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Your otp is here:"+otp+"</b>", // html body
              });

              if(info){
                 return res.redirect('/checkOtp');
              }
              else{
                return res.redirect('/')
              }  
        }
        else{
            console.log("record not found");
        }
    })
}


module.exports.checkOtp = function(req,res){
    return res.render('checkotp');
}

module.exports.checkOTPData = function(req,res){
    // console.log(req.cookies.setOTP);
    // console.log(req.body);
    if(req.body.otp == req.cookies.setOTP)
    {
        return res.redirect('recoverPassword');
    }
    else{
        return res.redirect('/checkOtp');
    }
}


module.exports.recoverPassword = function(req,res){
    return res.render('recoverPassword');
}


module.exports.recoverPass = function(req,res){
    // console.log(req.body);
    var emailData = req.cookies.userEmail;
    if(req.body.password == req.body.cpassword)
    {
        // console.log(req.cookies.userEmail);
        Admin.findOne({email: emailData}, function(err,record){
            if(err){
                console.log("something wrong");
                return res.redirect('/recoverPassword');
            }
            if(record){
                Admin.findByIdAndUpdate(record.id,{
                    password : req.body.password
                },function(err,data){
                    if(err){
                        console.log("password not change");
                        return res.redirect('/recoverPassword');
                    }
                    res.cookie('setOTP','');
                    res.cookie('userEmail','');
                    return res.redirect('/');
                })
            }
            else{
                return res.redirect('/recoverPassword');
            }
        })
    }
    else{
        return res.redirect('/recoverPassword');
    }
}