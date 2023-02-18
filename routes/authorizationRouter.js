var express = require('express');
var dbConnection = require('../code/dbConnection');

var authRouter = express.Router();


authRouter.use('', function (req, res, next) {
    if (req.url == '/') {
        res.render("AuthPage.html");
    } else {
        next();
    }
});

module.exports = authRouter;


//---------------------------------------------------Private functions-------------------------------
