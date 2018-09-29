
'use strict';

module.exports = function () {

    const express = require('express');
    const app = express();
    var path = require('path');
    var favicon = require('serve-favicon');
    var fs = require('fs');
    var rfs = require('rotating-file-stream');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    require('dotenv').config();
    var cookieParser = require('cookie-parser');
    var port = process.env.PORT || 80;

    app.use(cookieParser(process.env.COOKIE_SECRET));
	
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    var vet = require('../routes/vet');
    var api_vet = require('../routes/api_vet');
    var authorize = require('../routes/authorize');
	
    var routes = require('../routes/_index');
    var apis = require('./apis/_index');
	
    //setup vetter to check logged in auth for all requests
    app.use(vet);
	
    //setup authorize(logged-in) checker for all /office routes
    app.use('/office', authorize);
	
    //setup authorize(logged-in) checker for all /api/ routes
    app.use('/api/private/', api_vet);
	
    //require and activate chat system
    require('../src/app/chat')(io);
	
    //require and activate db populator
    require('../src/app/populate')();
	
    //require and activate voting bot
    require('../src/app/bot')();
	
    //require and verify email server
    require('../src/app/email-verify')();
	
	
    var logDirectory = path.join(__dirname, '../logs');
	
    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
	
    // defaults
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(favicon(path.join(__dirname, '../public/img', 'favicon.ico')));
	
    // ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
	
    // create a rotating write stream
    var accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory
    });

    //note that morgan is not configured to log IP addresses!
    app.use(morgan('combined', {stream: accessLogStream}));
	

    // setup routes
    routes(app);
    apis(app);
	
	
    // Additional middleware which will set headers that we need on each request.
    app.use(function(req, res, next) {
        // Set permissive CORS header - this allows this app to be used only as
        // an API app in conjunction with something like webpack-dev-app.
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
	
        // Disable caching so we'll always get the latest comments.
        res.setHeader('Cache-Control', 'no-cache');
        next();
    });
	
	
    //custom app error handler function
    app.use(function(err, req, res, next) {
        console.log('process err (500) : \n', err);
        res.status(500).send('Sorry, something broken on our side. We\'re fixing it!');
    });
	
    //custom file not found error handler function
    app.use(function(req, res, next) {
        console.log('files not found (404) err: ', req.url);
        //res.status(404).send("custom not found handler called");
        res.status(404).render('static/404.ejs');
    });
	
	
    http.listen(process.env.PORT || 80, function() {
        console.log('    > server is live on port', process.env.PORT || 80, '!');
    });

	
};
