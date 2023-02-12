var mysql = require("mysql2");

var dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "noda",
    password: "1234"
});

dbConnection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
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
            console.log(catalogRecords);
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
    }
};

module.exports = dbConnectionBuilder;