var express = require('express');

var mainRouter = express.Router();

//This function of the main site page
var mainRequestFunction = function (req, res) {
    res.render("MainPage.html");
}

mainRouter.get('/main', mainRequestFunction);
mainRouter.use('', function (req, res, next) {
    if (req.url == '/') {
        mainRequestFunction(req, res);
    } else {
        next();
    }
});

module.exports = mainRouter;