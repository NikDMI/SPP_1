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
    res.render("RegisterPageSeller.html");
});


regRouter.post('/Seller/Register', function (req, res, next) {
    registerNewSeller(req, res, next);
});


module.exports = regRouter;


//---------------------------------------------------Private functions-------------------------------

async function registerNewCustomer(req, res, next) {
    //Check user data
    let userEmail = req.body.userEmail;
    if (!checkCustomerFormData(req.body)) {
        res.redirect("/Registration/Customer");
        return;
    }
    let isUserExists = await dbConnection.isUserExistsWithEmail(userEmail);
    if (isUserExists !== null) {
        res.send("User with email already exists!");
        return;
    } else {
        //Add new user to DB
        let user = {
            person_role_id: 0,
            person_name: req.body.userName,
            person_surname: req.body.userSurname,
            person_email: userEmail,
            person_password: req.body.userPassword
        };
        dbConnection.addNewUser(user);
    }
    res.redirect("/Authorization");
}


async function registerNewSeller(req, res, next) {
    //Check user data
    let sellerEmail = req.body.sellerEmail;
    if (!checkSellerFormData(req.body)) {
        res.redirect("/Registration/Seller");
        return;
    }
    let isUserExists = await dbConnection.isUserExistsWithEmail(sellerEmail);
    if (isUserExists !== null) {
        res.send("User with email already exists!");
        return;
    } else {
        //Add new seller to DB
        let user = {
            person_role_id: 1,
            person_name: req.body.sellerName,
            person_surname: '',
            person_email: sellerEmail,
            person_password: req.body.sellerPassword
        };
        dbConnection.addNewUser(user);
    }
    res.redirect("/Authorization");
}


function checkCustomerFormData(formData) {
    console.log(formData);
    if (formData.userName != '' && formData.userEmail != '' && formData.userSurname != '' && formData.userPassword != '') {
        //Check data formats
        
    } else {
        return false;
    }
    return true;
}


function checkSellerFormData(formData) {
    console.log(formData);
    if (formData.sellerName != '' && formData.sellerEmail != '' && formData.sellerPassword != '') {
        //Check data formats

    } else {
        return false;
    }
    return true;
}