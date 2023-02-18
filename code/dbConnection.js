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
    },

    //Checks if user exists
    isUserExists: async function (userEmail) {
        try {
            let userRecord = await dbConnection.promise().query(`SELECT * FROM \`persons\` WHERE person_email = '${userEmail}'`);
            if (userRecord[0].length > 0) {
                return true;
            }
        } catch (err) {
            return true;
        }
        return false;
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
    }
};

module.exports = dbConnectionBuilder;