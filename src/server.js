
'use strict';

module.exports = function () {

    require('dotenv').config();
    const express = require('express');
    const app = express();
    const path = require('path');
    const favicon = require('serve-favicon');
    const settings = require('../config/settings');
    const fs = require('fs');
    const rfs = require('rotating-file-stream');
    const morgan = require('morgan');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const port = (process.env.NODE_ENV == 'production ' || process.env.NODE_ENV == 'staging') ? settings.PORT + 8001 : settings.PORT;
    
    app.use(cookieParser(process.env.COOKIE_SECRET));
	
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    const vet = require('../routes/vet');
    const api_vet = require('../routes/api_vet');
    const authorize = require('../routes/authorize');
	
    const routes = require('../routes/_index');
    const apis = require('./apis/_index');
	
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
	
	
    const logDirectory = path.join(__dirname, '../logs');
	
    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
	
    // defaults
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(favicon(path.join(__dirname, '../public/assets/img', 'favicon.ico')));
	
    // ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
	
    // create a rotating write stream
    const accessLogStream = rfs('access.log', {
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
	
	
    http.listen(port, function() {
        console.log('    > server is live on port', port , '!');
    });

	
};
