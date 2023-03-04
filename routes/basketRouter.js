var express = require('express');
var dbConnection = require('../code/dbConnection');
var session = require('../code/userSession');

//-------------------------------------------Global vars


var basketRouter = express.Router();


//SecurityFunction
basketRouter.use(async function (req, res, next) {
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
        res.send("Forbidden: have not permission");
        return;
    }
    next();
});


basketRouter.use('', async function (req, res, next) {
    if (req.url == '/') {
        let userId = session.getUserBySessionId(req.cookies.sessionId);
        let basketRecords = await getBasketRecords(userId);
        res.render("Basket/BasketPage.html", { items: basketRecords});
    } else {
        next();
    }
});


// Add new record to user busket
basketRouter.use('/Add', async function (req, res, next) {
    let userId = session.getUserBySessionId(req.cookies.sessionId);
    let itemId = req.query.itemId;
    if (itemId == null) {
        res.send("Bad request");
        return;
    }
    let item = dbConnection.getItemById(itemId);
    if (item == null) {
        res.send("Item not found");
        return;
    }
    if (!dbConnection.addRecordToBusket(userId, itemId)) {
        res.send("Внутренняя ошибка добавления товара в корзину");
        return;
    }
    res.send("Товар успешно добавлен в корзину!");
    return;
});


module.exports = basketRouter;


//---------------------------------------------------Private functions-------------------------------

// Get all basket records of specified user
async function getBasketRecords(userId) {
    let basketRecords = await dbConnection.getBasketRecordsByUserId(userId);
    if (basketRecords == null) {
        return [];
    }
    // Add info about item
    for (let record of basketRecords) {
        let item = await dbConnection.getItemById(record.br_item_id);
        if (item == null)
            continue;
        record.itemImageUrl = item.item_img_path;
        record.itemName = item.item_name;
        record.itemDescription = item.item_description;
        record.itemPrice = item.item_price;
        record.priceDescription = await dbConnection.getPriceDescById(item.item_price_type_id);
    }
    return basketRecords;
}