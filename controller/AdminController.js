const Admin = require('../models/admin');
const fs = require('fs');
const  path = require('path');

const nodemailer = require('../config/nodemailer');

module.exports.dashboard = function(req,res){
    req.flash('success','Login successfully');
    return res.render('dashboard');
}

module.exports.addAdmin = function(req,res){
    return res.render('add_admine');
}


module.exports.GoogleLogin = function(req,res){
    // console.log("login success");
    if(req.isAuthenticated()){
        console.log(req.isAuthenticated());
        return res.redirect('/dashboard')
    }
    return res.render('login', { 'layout' : false});
}

module.exports.insert_admin = function(req,res){

    Admin.uploadedAvatar(req,res,function(err){
    // console.log(req.body);
    // console.log(req.file);
    
        if(err){
            console.log("image not uploaded");
            return false;
        }
        if(req.file){
            var avatar = Admin.avatarPath+"/"+req.file.filename;
            var name = req.body.fname+" "+req.body.lname;
            Admin.create({
                name : name,
                email : req.body.email,
                password : req.body.password,
                gender : req.body.gender,
                hobby : req.body.hobby,
                city : req.body.city,
                avatar : avatar,
                description : req.body.description
            },function(err,record){
                // console.log(record);
                if(err){
                    console.log('table is not created');
                    req.flash('error','Error');
                    return false;
                }
                // console.log(record);
                req.flash('success','Insert successfully');
                return res.redirect('back');
            })
        }
    });
}

module.exports.viewAdmin = async function(req,res){
    try{
        var record = await Admin.find({});
             if(record){
                 return res.render('view_admin',{
                     'AllRecord' : record
                 });
            }
            else{
                console.log('Record not found');
                return false;
            }
    }
    catch{
        console.log(err);
    }

    // Admin.find({},function(err,record){
    //     if(err){
    //         console.log('Record not found');
    //         return false;
    //     }
    //     return res.render('view_admin',{
    //         'AllRecord' : record
    //     })
    // })
}

module.exports.updatePage = function(req,res){
    // console.log(req.query.id);
    Admin.findById(req.query.id,function(err,record){
        if(err){
            console.log('Record is not updated');
            return false;
        }
        return res.render('update',{
            'UpdateRec' : record 
        }); 
    })
}

module.exports.updateRecord = function(req,res){
    Admin.uploadedAvatar(req,res,function(err){
        var hiddenId = req.body.p_id;
        console.log(hiddenId);
        if(err){
            console.log('Record not Updated');
            return false;
        }
        console.log(req.body);
        console.log(req.file);
        if(req.file){

            Admin.findById(hiddenId,function(err,record){
                if(err){console.log('hidden id not found'); return false;}
                if(record.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',record.avatar));
                }
                var profile_img = Admin.avatarPath+"/"+req.file.filename;
                Admin.findByIdAndUpdate(hiddenId,{
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                gender : req.body.gender,
                hobby : req.body.hobby,
                city : req.body.city,
                avatar : profile_img,
                description : req.body.description
                },function(err,record){
                    if(err){
                        console.log('Record is not updated');
                        return false;
                    }
                    return res.redirect('/view_admin')
                });
            })
        }
        else{
            console.log("image is not inserted");
            var hiddenId = req.body.p_id;
            Admin.findById(hiddenId,function(err,record){
                if(err){
                    console.log('Else update part is not working');
                    return false;
                }
                // console.log(record);
                var avatar = record.avatar;
                console.log(avatar);
                Admin.findByIdAndUpdate(hiddenId,{
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                gender : req.body.gender,
                hobby : req.body.hobby,
                city : req.body.city,
                avatar : avatar,
                description : req.body.description
                },function(err,record){
                    if(err){
                        console.log('Record is not updated');
                        return false;
                    }
                    return res.redirect('/view_admin');
                })
            })
        }

    })
}

module.exports.deleteRecord = function(req,res){
    // console.log(req.query.id);
    Admin.findById(req.query.id ,function(err,data){
        if(err){
            console.log('record not delete');
        }
        if(data.avatar){
            fs.unlinkSync(path.join(__dirname,"..",data.avatar));
        }
        Admin.findByIdAndDelete(req.query.id,function(err,data){
            if(err){
                console.log("All data not deleted");
                return false;
            }
        })
        return res.redirect('/view_admin');
    });
}

module.exports.login = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    return res.render('login', { 'layout' : false});
}

module.exports.checkLogin = function(req,res){
    req.flash('successDashboard','login successfully');
    return res.redirect('/dashboard')
}

module.exports.password_page = function(req,res){
    return res.render('change_password')
}


module.exports.change_password = function(req,res){
    var old_pass = req.body.old_password;
    var new_pass = req.body.new_password;
    var con_pass = req.body.conf_password;
    // console.log(req.user);
    // console.log(req.user.password);
    if(req.user.password == old_pass){
        if(old_pass != new_pass){
            if(new_pass == con_pass){
                Admin.findByIdAndUpdate(req.user.id,{
                    password : new_pass
                },function(err,updateAdminPass){
                    if(err){
                        console.log("Password is not updated");
                        return false;
                    }
                    req.logout(function(err){
                        if(err){
                            console.log("Profile is not Logout");
                            return false;
                        }
                        return res.redirect('/');
                    });
                })
            }
            else{
                return res.redirect('back');
            }
        }
        else{
            return res.redirect('back');
        }
    }
    else{
        console.log('Old Password is Wrong');
        return res.redirect('back');
    }
}

module.exports.viewProfile = function(req,res){
    return res.render('view_profile')
}

module.exports.logout = function(req,res){
    req.logout(function(err){
        if(err){
            console.log('session not destroy');
            return false;
        }
        return res.redirect('/')
    })

}

//forgot password functions
module.exports.lostForgot = function(req,res){
    return res.render('lostForgot', {layout:false});
}


module.exports.checkForgot = function(req,res){
    Admin.findOne({email : req.body.email}, function(err,AdminData){
        if(err){
            console.log("EMail not found");
            return false;
        }
        if(AdminData){

            var otp = Math.random();
            var newOtp = parseInt(otp * 100000);
            

            res.cookie('email',req.body.email);
            res.cookie("otpData",newOtp);

            
            nodemailer.sendMail({
                from : "savanvaghasiya13@gmail.com",
                to : "piyush0101nakarani@gmail.com",
                subject : "Send OTP",
                html : "YOur OTP is="+newOtp+" <br>Just Testing purpose",
            }, function(err, info){
                if(err){
                    console.log(err);
                    return false;
                }
                console.log("send mail successfully");
                return res.redirect('/checkOTP');
            })
        }
        else{
            console.log("Admin data not found");
            return res.redirect('back');
        }
    })
}

module.exports.checkOTP = function(req,res){
    return res.render('checkOTP',{ layout : false});
}

module.exports.verifyOTP = function(req,res){
    if(req.body.checkOTP == req.cookies.otpData)
    {
        return res.redirect('/generateNewPassword');
    }
    else{
        return res.redirect('/checkOTP');
    }
}

module.exports.generateNewPassword = function(req,res){
    return res.render('generateNewPassword',{ layout : false});
}

module.exports.ResetPassword = function(req,res){
    // console.log(req.body);
    // console.log(req.cookies.email);
    if(req.body.npass == req.body.cpass){
        Admin.findOne({email : req.cookies.email}, function(err,adminData){
            if(err){
                console.log(err);
                return false;
            }
            if(adminData){
                Admin.findByIdAndUpdate(adminData.id,{
                    password : req.body.npass
                }, function(err, UpdateAdmin){
                    if(err){
                        console.log("not updated");
                        return false;
                    }
                    res.cookie('email','');
                    res.cookie('otpData','');
                    return res.redirect('/');
                })
            }
        })
    }
    else{
        return res.redirect('/generateNewPassword');
    }
}