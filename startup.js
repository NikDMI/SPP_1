'use strict';
//System modules
var http = require('http');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
//Routes
var mainRouter = require('./routes/mainRouter.js');


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
app.use('/', mainRouter);
app.use(function (req, res) {
    res.send('Not found');
});

//Startup
http.createServer(app).listen(port);