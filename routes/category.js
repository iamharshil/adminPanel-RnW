const express = require('express');
const passport = require('passport');

const route = express.Router();

const categoryController = require('../controllers/category');

route.get('/add_category',passport.checkAuthentication,categoryController.addCategory);

route.post('/insertCategoryRecord', passport.checkAuthentication,categoryController.insertCategoryRecord);

module.exports = route;