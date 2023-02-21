var mysql = require("mysql2");

var dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "noda",
    password: "1234"
});

dbConnection.connect(function (err) {
    if (err) {
        return console.error("Îøèáêà: " + err.message);
    }
});


var dbConnectionBuilder = {

    //Close db connection 
    closeConnection: function () {
        dbConnection.end();
    },


    //Get all items in catalog table or return []
    getCatalogItems: async function () {
        let items = [];
        try {
            let catalogRecords = await dbConnection.promise().query("SELECT * FROM `catalog`");
            for (let catalogRecord of catalogRecords[0]) {
                let itemId = catalogRecord.cat_item_id;
                console.log(itemId);
                try {
                    let item =
                        await dbConnection.promise().query(`SELECT * FROM \`items\` WHERE item_id = ${itemId}`);
                    item = item[0][0];
                    item.imageUri = "\\img\\noimage.png";
                    items.push(item);
                } catch (err) {

                }
            }
        } catch (err) {

        }
        return items;
    },


    //Checks if user exists
    isUserExistsWithEmail: async function (userEmail) {
        try {
            let userRecord = await dbConnection.promise().query(`SELECT * FROM \`persons\` WHERE person_email = '${userEmail}'`);
            if (userRecord[0].length > 0) {
                return userRecord[0][0];
            }
        } catch (err) {
            return null;
        }
        return null;
    },


    addNewUser: async function (user) {
        try {
            console.log(user);
            await dbConnection.promise().query(`INSERT INTO \`persons\`
                (person_role_id, person_name, person_surname, person_email, person_password)
                 VALUES (${user.person_role_id}, '${user.person_name}', '${user.person_surname}', '${user.person_email}', '${user.person_password}')`);

        } catch (err) {
            return false;
        }
        return true;
    },


    addNewItem: async function (item, manufactureId) {
        try {
            //Add item to items
            let resQuery = await dbConnection.promise().query(`INSERT INTO \`items\`
                (item_name, item_description, item_price, item_section_id, item_price_type_id, item_img_path)
                 VALUES ('${item.itemName}', '${item.itemDescription}', ${item.itemPrice}, 0, ${item.itemPriceTypeId}, 
                '${item.itemImage}')`);
            let itemId = resQuery[0].insertId;
            //Add item to storage
            await dbConnection.promise().query(`INSERT INTO \`storage\`
                (st_manufacture_id, st_item_id, st_count)
                 VALUES (${manufactureId}, ${itemId}, ${item.itemStorageCount})`);
            //Add item to catalog
            //Add item to storage
            await dbConnection.promise().query(`INSERT INTO \`catalog\`
                (cat_manufacture_id, cat_item_id, cat_items_count)
                 VALUES (${manufactureId}, ${itemId}, ${item.itemCatalogCount})`);

        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    },


    getUserById: async function (userId) {
        try {
            let queryResult = await dbConnection.promise().query(`SELECT * FROM \`persons\` WHERE person_id = '${userId}'`);
            return queryResult[0][0];

        } catch (err) {
            return null;
        }
    },


    //Get all items in storage table or return []
    getStorageItemsBySellerId: async function (sellerId) {
        let items = [];
        try {
            let storageRecords = await dbConnection.promise().query(`SELECT * FROM \`storage\` WHERE st_manufacture_id=${sellerId}`);
            console.log(storageRecords);
            for (let storageRecord of storageRecords[0]) {
                let itemId = storageRecord.st_item_id;
                try {
                    let item =
                        await dbConnection.promise().query(`SELECT * FROM \`items\` WHERE item_id = ${itemId}`);
                    item = item[0][0];
                    item.imageUri = "\\img\\noimage.png";
                    items.push(item);
                } catch (err) {

                }
            }
        } catch (err) {

        }
        return items;
    },
};

module.exports = dbConnectionBuilder;