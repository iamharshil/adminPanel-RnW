const express = require('express');

const passport = require('passport');

const route = express.Router();

const subcategoryController = require('../controllers/subcategory');

route.get('/add_subcategory',passport.checkAuthentication,subcategoryController.add_subcategory);

route.post('/addSubcategoryData', passport.checkAuthentication, subcategoryController.addSubcategoryData);


route.get('/view_subcategory', passport.checkAuthentication, subcategoryController.viewSubcategory);
module.exports = route;