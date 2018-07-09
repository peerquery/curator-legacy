
'use strict';

var status = require('./status');
var activity = require('./activity');
var _app = require('./app');
var blacklist = require('./blacklist');
var curate = require('./curate');
var curators = require('./curators');
var data = require('./data');
var sponsor = require('./sponsor');
var stats = require('./stats');
var team = require('./team');
var users = require('./users');
	
module.exports = async function (app) {
	
	status(app);
	activity(app);
	_app(app);
	blacklist(app);
	curate(app);
	curators(app);
	data(app);
	sponsor(app);
	stats(app);
	team(app);
	users(app);
	
}
	
	