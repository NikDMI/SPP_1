var express = require('express');
var dbConnection = require('../code/dbConnection');
var session = require('../code/userSession');

//-------------------------------------------Global vars


var managerRouter = express.Router();

//SecurityFunction
managerRouter.use(async function (req, res, next) {
    let userId = session.getUserBySessionId(req.cookies.sessionId);
    if (userId === null || userId === undefined) {
        res.status = 401;
        res.send("Forbidden: not authorized");
        return;
    }
    let user = await dbConnection.getUserById(userId);
    console.log(user);
    if (user == null || user.person_role_id != 1) {
        res.status = 403;
        res.send("Forbidden: can't have permission");
        return;
    }
    next();
});

managerRouter.use('', async function (req, res, next) {
    if (req.url == '/') {
        //Get list of registered items
        let userId = session.getUserBySessionId(req.cookies.sessionId);
        let items = await dbConnection.getStorageItemsBySellerId(userId);
        console.log(items);
        res.render("ItemManager/ItemsPage.html", { items: items, pages: [{ number: 1, isMain: true }, { number: 2 }]});
    } else {
        next();
    }
});


managerRouter.use('/New', async function (req, res, next) {
    res.render("ItemManager/EditItemPage.html");
});


module.exports = managerRouter;


//---------------------------------------------------Private functions-------------------------------
