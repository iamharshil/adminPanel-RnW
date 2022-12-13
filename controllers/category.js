const Category = require('../models/category');


module.exports.addCategory = function(req,res){
    return res.render('add_category');
}

module.exports.insertCategoryRecord = (req,res)=>{
    // console.log(req.body);
    Category.create(req.body,function(err,data){
        if(err){
            console.log("something wrong");
            return false;
        }
        req.flash('success',"category inserted successfully");
        return res.redirect('back')
    })
}