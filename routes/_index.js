
'use strict';

var auth = require('./auth');
var community = require('./community');
var curators = require('./curators');
var office = require('./office');
var _static = require('./static');
var trail = require('./trail');
	
module.exports = async function (app) {
	
	auth(app);
	community(app);
	curators(app);
	office(app);
	_static(app);
	trail(app);
	
}
	
	