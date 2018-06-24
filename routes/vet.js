
'use strict'

var bcrypt = require('bcrypt');
var pool = require('./../config/connection');
var jwt = require('jwt-simple');
require('dotenv').config();

var secret = Buffer.from(process.env.JWT_SECRET, 'hex');	// HS256 secrets are typically 128-bit random strings, for example hex-encoded:

const saltRounds = 12;

module.exports = function (req, res, next) {
	
	if(req.signedCookies.auth) {
		
		try {
			
			var auth = req.signedCookies.auth;
			
			var decoded = jwt.decode(auth, secret);
				
			var expiration = new Date(decoded.expiration);
				
			var date = new Date();
				
			//checks to make sure that the token has NOT expired!
				
			if(expiration > date){
				
				req.user = { username: decoded.username, email: decoded.email, role: decoded.role, authority: decoded.authority };
				
				next();
				
			} else {
					
				req.user = null;
				
				next();
				
			}
			
			
		} catch(err) {
			
			console.log(err);
			res.status(401).send('Could not vet auth');
			
		}
		
	} else {
		
		next();
		
	}

}
