const mongoose = require('mongoose');


const CategorySchema = mongoose.Schema({
    category_name : {
         type : String,
         required : true
    }
});



const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;