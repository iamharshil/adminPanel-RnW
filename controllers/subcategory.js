const category = require('../models/category');
const Subcategory = require('../models/subcategory');


module.exports.add_subcategory = (req,res) =>{
    category.find({},function(err,allcatRecord){
        if(err){
            console.log("something wrong");
            return false;
        }
        return res.render('add_subcategory',{
            catData : allcatRecord
        });

    })
}


module.exports.addSubcategoryData = (req,res) => {
    // console.log(req.body);
    Subcategory.create(req.body, function(err,Addsub){
        if(err){
            console.log("something wrong");
            return false;
        }
        req.flash("success", "Subcategory record inserted");
        return res.redirect('/subcategory/add_subcategory');
    })
}

module.exports.viewSubcategory = (req,res) => {
    // Subcategory.find({}, function(err,subdata){
    //     if(err){
    //         console.log("err");
    //         return false;
    //     }
    //    
    // })


    Subcategory.find({}).populate('category_id').exec(function(err,allData){
        if(err){
            console.log(err);
            return false;
        }
        // console.log(allData);
        return res.render('view_subcategory',{
         subdata : allData
        })
    })
}