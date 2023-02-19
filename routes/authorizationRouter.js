var express = require('express');
var dbConnection = require('../code/dbConnection');
var session = require('../code/userSession');

//-------------------------------------------Global vars


var authRouter = express.Router();


authRouter.use('', function (req, res, next) {
    if (req.url == '/') {
        res.render("AuthPage.html");
    } else {
        next();
    }
});


authRouter.use('/Auth', async function (req, res, next) {
    //console.log(req.cookies.sessionId);
    if (!isAuthParamsValid(req.body)) {
        res.redirect('/Authorization');
        return;
    }
    //Get user from DB
    let user = await dbConnection.isUserExistsWithEmail(req.body.userEmail);
    if (user === null) {
        res.send("Wrong email or password! ('email not found')");
        return;
    }
    //Check user password
    if (!checkUserPassword(user.person_password, req.body.userPassword)) {
        res.send("Wrong email or password! ('worng password')");
        return;
    }
    //Create user session for this IP
    let sessionId = session.createUserSession(user.person_id, user.person_email);
    res.cookie("sessionId", sessionId);
    res.send("Ok - " + sessionId);
});


module.exports = authRouter;


//---------------------------------------------------Private functions-------------------------------

function isAuthParamsValid(authParams) {
    if (authParams.userEmail == '' || authParams.userPassword == '') {
        return false;
    }
    return true;
}


function checkUserPassword(dbPasswordKey, userPassword) {
    //Now we save passeords without encryption
    if (dbPasswordKey == userPassword) {
        return true;
    }
    return false;
}