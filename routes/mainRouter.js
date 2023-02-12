var express = require('express');
var dbConnection = require('../code/dbConnection');

var mainRouter = express.Router();

//This function of the main site page
var mainRequestFunction = async function (req, res) {
    //getCatalogItems();
    let items = [];
    try {
        items = await getCatalogItems();
    } catch (err) {

    }
    console.log(items);
    res.render("MainPage.html", { sectionName: "Products", items: items});
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


//---------------------------------------------------Private functions-------------------------------
const MAX_ITEMS_COUNT_PER_PAGE = 10;

function getCatalogItems(pageNumber) {
    //Get users from DB
    let dbResult = dbConnection.getCatalogItems();
    return dbResult;
}