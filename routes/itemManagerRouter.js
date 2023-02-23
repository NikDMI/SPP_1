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
        res.render("ItemManager/ItemsPage.html", { items: items, pages: [{ number: 1, isMain: true }, { number: 2 }]});
    } else {
        next();
    }
});


managerRouter.use('/New', async function (req, res, next) {
    let sections = await dbConnection.getSections(0);
    let item = {
        item_id: -1,
        item_img_path: "/img/noimage.img",
        item_name: "",
        item_description: "",
        item_price: "0"
    }
    res.render("ItemManager/EditItemPage.html", {sections: sections, item: item});
});

managerRouter.use('/Edit', async function (req, res, next) {
    let sections = await dbConnection.getSections(0);
    let itemId = req.query.itemId;
    if (itemId == null) {
        res.send("Not found");
        return;
    }
    let item = await dbConnection.getItemById(itemId);
    res.render("ItemManager/EditItemPage.html", { sections: sections, item: item });
});

managerRouter.use('/Delete', async function (req, res, next) {
    let sections = await dbConnection.getSections(0);
    let itemId = req.query.itemId;
    if (itemId == null) {
        res.send("Not found");
        return;
    }
    await dbConnection.removeItem(itemId);
    res.redirect("/Items");
});


//Add or edit items
managerRouter.post('/Editor', async function (req, res, next) {
    if (!isValidItemFormData(req.body)) {
        res.send("Bad data");
        return;
    }
    //Change image
    if (!req.files && req.body.itemId == -1) {
        req.body.itemImage = "/img/noimage.png";
    } else if (req.files) {
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
        //update item
        await dbConnection.updateItem(req.body, userId);
    }
    res.redirect("/Items");
});


module.exports = managerRouter;


//---------------------------------------------------Private functions-------------------------------

function isValidItemFormData(itemData) {
    if (isNull(itemData.itemId) || isNull(itemData.itemName) || isNull(itemData.itemDescription) ||
        isNull(itemData.itemPrice) || isNull(itemData.itemPriceTypeId) ||
        isNull(itemData.itemStorageCount) || isNull(itemData.itemCatalogCount) || isNull(itemData.itemSection)) {
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
