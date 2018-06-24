
'use strict'

var bcrypt = require('bcrypt');
var pool = require('./../config/connection');
var jwt = require('jwt-simple');
require('dotenv').config();

var secret = Buffer.from(process.env.JWT_SECRET, 'hex');	// HS256 secrets are typically 128-bit random strings, for example hex-encoded:

const saltRounds = 12;

module.exports = function (req, res, next) {
	
	if(!req.user) {
		
		res.redirect("/");
		
	} else if(req.user && req.user == null) {
		
			res.redirect("/login");
			
	} else {
		
		next();
		
	}

}
