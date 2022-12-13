const mongoose = require('mongoose');


const SubcategorySchema = mongoose.Schema({

    category_id : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "Category"
    },
    subcategory_name : {
        type : String,
        required : true
    }
});



const Subcategory = mongoose.model('Subcategory',SubcategorySchema);

module.exports = Subcategory;