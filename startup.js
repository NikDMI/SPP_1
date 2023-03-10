'use strict';
//System modules
var http = require('http');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//Routes
var mainRouter = require('./routes/mainRouter.js');
var registrationRouter = require('./routes/registrationRouter.js');
var authorizationRouter = require('./routes/authorizationRouter.js');
var itemManagerRouter = require('./routes/itemManagerRouter');
var basketRouter = require('./routes/basketRouter');
var dbConnection = require('./code/dbConnection.js');



//Setup params
var port = 1337;
var viewsFolder = path.resolve(__dirname, "views");
var app = express();


//Express settings
app.set('views', viewsFolder);
app.set('view engine', 'ejs');
app.engine("html", ejs.renderFile);

//Middlewares
app.use(express.static(path.resolve(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use('/', mainRouter);
app.use('/Registration', registrationRouter);
app.use('/Authorization', authorizationRouter);
app.use('/Items', itemManagerRouter);
app.use('/Basket', basketRouter);
app.use(function (req, res) {
    res.send('Not found');
});

//Startup
http.createServer(app).listen(port);
//dbConnection.closeConnection();
