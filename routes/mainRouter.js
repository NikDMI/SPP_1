var express = require('express');
var dbConnection = require('../code/dbConnection');
var session = require('../code/userSession');

var mainRouter = express.Router();

//This function of the main site page
var mainRequestFunction = async function (req, res) {
    let items = [];
    try {
        items = await getCatalogItems();
    } catch (err) {

    }
    //Get auth user
    let userInfo = null;
    console.log(req.cookies);
    if (req.cookies?.sessionId) {
        userId = session.getUserBySessionId(req.cookies.sessionId)
        if (userId) {
            userInfo = await dbConnection.getUserById(userId);
        }
    }
    console.log(userInfo);
    let isSeller = false;
    isSeller = (userInfo?.person_role_id === 1) ? true : false;
    res.render("MainPage.html", { sectionName: "Products", items: items, isSeller: isSeller});
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