var express = require('express');
var dbConnection = require('../code/dbConnection');

var regRouter = express.Router();


regRouter.get('/Role', function (req, res, next) {
    res.render("RegisterPageRole.html");
});

regRouter.get('/Customer', function (req, res, next) {
    res.render("RegisterPageCustomer.html");
});

//Register new customer
regRouter.post('/Customer/Register', function (req, res, next) {
    registerNewCustomer(req, res, next);
});

regRouter.get('/Seller', function (req, res, next) {
    //res.render("MainPage.html");
});


module.exports = regRouter;


//---------------------------------------------------Private functions-------------------------------

function registerNewCustomer(req, res, next) {
    console.log(req.body);
    res.send("Success!");
}