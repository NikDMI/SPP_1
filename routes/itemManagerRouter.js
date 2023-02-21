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


//Add or edit items
managerRouter.post('/Editor', async function (req, res, next) {
    if (!isValidItemFormData(req.body)) {
        res.send("Bad data");
        return;
    }
    //Change image
    //console.log(req);
    if (!req.files) {
        req.body.itemImage = "/img/noimage.png";
    } else {
        //Upload image
        let imgName = req.body.itemId + req.cookies.sessionId + process.hrtime()[0] + ".png";
        let img = req.files.itemImage;
        req.body.itemImage = "/img/userItems/" + imgName;
        img.mv('./static/img/userItems/' + imgName, function (err) {
            if (err)
                req.body.itemImage = "/img/noimage.png";
        });
    }
    let userId = session.getUserBySessionId(req.cookies.sessionId);
    if (req.body.itemId == -1) {
        await dbConnection.addNewItem(req.body, userId);
    } else {

    }
    res.redirect("/Items");
});


module.exports = managerRouter;


//---------------------------------------------------Private functions-------------------------------

function isValidItemFormData(itemData) {
    if (isNull(itemData.itemId) || isNull(itemData.itemName) || isNull(itemData.itemDescription) ||
        isNull(itemData.itemPrice) || isNull(itemData.itemPriceTypeId) ||
        isNull(itemData.itemStorageCount) || isNull(itemData.itemCatalogCount) || isNull(itemData.itemCategory)) {
        return false;
    }
    let itemPrice = Number.parseInt(itemData.itemPrice);
    let storageCount = Number.parseInt(itemData.itemStorageCount);
    itemData.itemStorageCount = storageCount;
    let catalogCount = Number.parseInt(itemData.itemCatalogCount);
    itemData.itemCatalogCount = catalogCount;
    if (storageCount < catalogCount) {
        return false;
    }
    if (itemPrice <= 0) {
        return false;
    }
    return true;
}


function isNull(variable) {
    if (variable === null || variable === undefined || variable === '') {
        return true;
    }
    return false;
}
