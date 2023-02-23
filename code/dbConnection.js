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
    getCatalogItems: async function (sectionId) {
        let items = [];
        try {
            let catalogRecords = await dbConnection.promise().query("SELECT * FROM `catalog`");
            for (let catalogRecord of catalogRecords[0]) {
                let itemId = catalogRecord.cat_item_id;
                try {
                    item = await dbConnectionBuilder.getItemById(itemId);
                    console.log("a" + sectionId + " b" + item.item_section_id);
                    if (sectionId == -1 || item.item_section_id == sectionId) {
                        items.push(item);
                    }
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
                 VALUES ('${item.itemName}', '${item.itemDescription}', ${item.itemPrice}, ${item.itemSection}, ${item.itemPriceTypeId},
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


    removeItem: async function (itemId, manufactureId) {
        try {
            console.log("aA" + itemId);
            //Add item to items
            await dbConnection.promise().query(`DELETE FROM \`storage\` WHERE st_item_id = ${itemId}`);
            await dbConnection.promise().query(`DELETE FROM \`catalog\` WHERE cat_item_id = ${itemId}`);
            await dbConnection.promise().query(`DELETE FROM \`items\` WHERE item_id = ${itemId}`);
            //Add item to storage
            //Add item to catalog
            //Add item to storage

        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    },


    updateItem: async function (itemData, manufactureId) {
        try {
            let item = await dbConnectionBuilder.getItemById(itemData.itemId);
            if (item == null)
                return;
            let imageUpdate = '';
            if (itemData.itemImage  && itemData.itemImage != '') {
                imageUpdate = `,item_img_path = '${itemData.itemImage}'`;
            }
            let resQuery = await dbConnection.promise().query(`UPDATE \`items\` SET item_name = '${itemData.itemName}',
                item_description = '${itemData.itemDescription}', item_price = ${itemData.itemPrice},
                item_section_id = ${itemData.itemSection}, item_price_type_id = ${itemData.itemPriceTypeId} ${imageUpdate} WHERE item_id = ${itemData.itemId}`);

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


    getItemById: async function (itemId) {
        try {
            let item =
                await dbConnection.promise().query(`SELECT * FROM \`items\` WHERE item_id = ${itemId}`);
            item = item[0][0];
            item.price_description = await dbConnectionBuilder.getPriceDescById(item.item_price_type_id);
            return item;

        } catch (err) {
            return null;
        }
    },


    getPriceDescById: async function (priceTypeId) {
        try {
            let queryResult = await dbConnection.promise().query(`SELECT * FROM \`price_type\` WHERE priceType_id = '${priceTypeId}'`);
            return queryResult[0][0].priceType_description;

        } catch (err) {
            return null;
        }
    },


    //Get all items in storage table or return []
    getStorageItemsBySellerId: async function (sellerId) {
        let items = [];
        try {
            let storageRecords = await dbConnection.promise().query(`SELECT * FROM \`storage\` WHERE st_manufacture_id=${sellerId}`);
            for (let storageRecord of storageRecords[0]) {
                let itemId = storageRecord.st_item_id;
                try {
                    //let item =
                    //    await dbConnection.promise().query(`SELECT * FROM \`items\` WHERE item_id = ${itemId}`);
                    let item = await dbConnectionBuilder.getItemById(itemId);
                    items.push(item);
                } catch (err) {

                }
            }
        } catch (err) {

        }
        return items;
    },


    //Get all items in storage table or return []
    getSections: async function (sectionId = 0) {
        let sections = [];
        try {
            let rootSections = await dbConnection.promise().query(`SELECT * FROM \`sections\` WHERE section_parent_id = ${sectionId}`);
            for (let sectionRecord of rootSections[0]) {
                sectionRecord.childSections = [];

                try {
                    let childSections = await dbConnectionBuilder.getSections(sectionRecord.section_id);
                    sectionRecord.childSections = childSections;
                } catch (err) {

                }
                sections.push(sectionRecord);
            }
        } catch (err) {

        }
        return sections;
    },
};

module.exports = dbConnectionBuilder;