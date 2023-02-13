var express = require('express');
var dbConnection = require('../code/dbConnection');

var regRouter = express.Router();


regRouter.get('/Role', function (req, res, next) {
    res.render("RegisterPageRole.html");
});

regRouter.get('/Customer', function (req, res, next) {
    res.render("RegisterPageCustomer.html");
});

regRouter.get('/Seller', function (req, res, next) {
    //res.render("MainPage.html");
});


module.exports = regRouter;


//---------------------------------------------------Private functions-------------------------------
