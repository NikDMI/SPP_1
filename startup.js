'use strict';
//System modules
var http = require('http');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require("body-parser");

//Routes
var mainRouter = require('./routes/mainRouter.js');
var registrationRouter = require('./routes/registrationRouter.js');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', mainRouter);
app.use('/Registration', registrationRouter)
app.use(function (req, res) {
    res.send('Not found');
});

//Startup
http.createServer(app).listen(port);
//dbConnection.closeConnection();
