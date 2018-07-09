
'use strict'

var bcrypt = require('bcrypt');
var pool = require('./../config/connection');
var cookieParser = require('cookie-parser');
var jwt = require('jwt-simple');
const uuidv1 = require('uuid/v1');
require('dotenv').config();

var email_new_pass = require('../src/app/emailer').new_pass;
var email_pass_reset = require('../src/app/emailer').reset;

var secret = Buffer.from(process.env.JWT_SECRET, 'hex');	// HS256 secrets are typically 128-bit random strings, for example hex-encoded:

const saltRounds = 12

 
module.exports = function (app) {

	app.get('/login', function(req, res){ 
		res
			.clearCookie('auth')
			.render('auth/login');
	});
	
	
	app.get('/reset', function(req, res){ 
		res
			.clearCookie('auth')
			.render('auth/reset');
	});
	
	
	app.get('/set', function(req, res){ 
		
		if(!req.signedCookies.auth) { res.status('401').send('No auth rights'); return };
		
		try {
			
			var auth = req.signedCookies.auth;
				
			var decoded = jwt.decode(auth, secret);
				
				var expiration = new Date(decoded.expiration);
				
				var date = new Date();
				
				//checks to make sure that the token has NOT expired!
				
				if(expiration > date){
					
					res.render('auth/set');
					
				} else {
					
					res.status(401).send('Token expired');
					
				}
			
				
			
		} catch(err) {
			
			console.log(err);
			res.status(401).send('Could not verify token');
			
		}
		
	});
	
	
	app.get('/invite', function(req, res){ 
		res
			.clearCookie('auth')
			.render('auth/invite');
	});
	
	
	app.get('/password_reset', function(req, res){ 
		res
			.clearCookie('auth')
			.render('auth/password_reset');
	});
	
	
	app.post('/invite', async function(req, res){
		
		try {
			var data = req.body.username;
			var sql = "CALL token_hash(?)";
			
			
			var results = await pool.query(sql, data);
			var token_hash = results[0][0].token_hash;
			
			
			//console.log("password has is: ", password_hash);
			
			
			var match = await bcrypt.compare(req.body.token, token_hash);
			
			if(match) {
				var data2 = req.body.username;
				var sql2 = "CALL activate_team(?)";
				await pool.query(sql2, data2);
				
				
				var currentDate = new Date();
				var expiration = new Date(currentDate.getTime() + (12 * 60 * 60 * 1000));	//expires in 12 hours

				var payload = { username: req.body.username, email: req.body.email, expiration: expiration }

				// encode
				var jwt_token = jwt.encode(payload, secret);
				//console.log(jwt_token);

				res
					.cookie('auth', jwt_token, {signed: true, maxAge: new Date(Date.now() + 1000 * 60 * 60 * 5), httpOnly: true })
					.sendStatus(200);
				
				
			} else {
				res.sendStatus(401);
			}
			
		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}
		
		
	});
	
	
	app.post('/login', async function(req, res){
		
		if(!req.body.pass || !req.body.email) {	res.status(405).send('No input supplied'); return; };
		
		try {
			var data = req.body.email;
			var sql = "CALL password_hash(?)";
			
			var results = await pool.query(sql, data);
			results = results[0][0];
			
			if(!results) {
				
				res.status(401).send("No such account");
				
			} else {
			
				var password_hash = results.password_hash;
			
				var match = await bcrypt.compare(req.body.pass, password_hash);
			
				if(match) {
			
					var sql2 = "CALL get_team(?)";
					var results2 = await pool.query(sql2, data);	//from above, data is: var data = req.body.email;
					var user = results2[0][0];

					var currentDate = new Date();
					var expiration = new Date(currentDate.getTime() + (12 * 60 * 60 * 1000));	//expires in 12 hours

					var payload = { username: user.account, email: user.email, role: user.role, authority: user.authority, expiration: expiration }

					// encode
					var jwt_token = jwt.encode(payload, secret);
					//console.log(jwt_token);

					res
						.cookie('auth', jwt_token, {signed: true, maxAge: new Date(Date.now() + 1000 * 60 * 60 * 5), httpOnly: true })
						.status(200)
						.send('successfully logged in');	
				
				
				} else {
					res.sendStatus(401);
				}
					
			}
				
		} catch(err) {
			
			console.log(err);
			res.sendStatus(500);
			
		}
		
		
	});
	
	
	app.post('/set', async function(req, res){
		
		if(!req.signedCookies.auth) { res.status(401).send('No token provided'); return };
		
		try {
			
			var auth = req.signedCookies.auth;
			var password = req.body.password;
			
			var decoded = jwt.decode(auth, secret);
				
				var expiration = new Date(decoded.expiration);
				
				var date = new Date();
				
				//checks to make sure that the token has NOT expired!
				
				if(expiration > date){
					
					var auth = req.signedCookies.auth;
					var account = decoded.username;
					var email = decoded.email;
			
					var data = account;
					var sql = "CALL password_hash(?)";
			
					var results = await pool.query(sql, data);
					var password_hash = results[0][0].password_hash;
				
					var match = await bcrypt.compare(req.body.password, password_hash);
			
					if(match) {
					
						res.status(405).send('New password cannot be same as old one');

					} else {
						
						//if new password is unique to existing one then ...
						
						const password_hash2 = await bcrypt.hash(req.body.password, saltRounds);
					
						var data = [ account, password_hash2 ];
						var sql = 'CALL set_password_hash(?,?)';
					
						await pool.query(sql, data);
					
						//send confirmation email here
						
						await email_new_pass(account, email);
					
						res.sendStatus(200);
				
						
					}
		
		
					
				} else {
					
					res.status(401).send('Token expired');
					
				}
			
				
			
		} catch(err) {
			
			console.log(err);
			res.status(401).send('Could not verify token');
			
		}
		
	});
	
	
	app.post('/api/reset', async function(req, res){
		
		const token = uuidv1();
		
		bcrypt.hash(token, saltRounds, async function(err, token_hash) {
			
			try {
				var sql = "CALL reset_password_hash(?,?)";
				var data = [ req.body.email, token_hash];
				var results = await pool.query(sql, data);
				
				if(!results[0][0].account || results[0][0].account == "") {
					
					res.status(404).send("No such email found");
				
				} else {
					
					var account = results[0][0].account;
					var status = await email_pass_reset(account, req.body.email, token);
				
					if (status == "OK") {
						//console.log('\n  * pass reset email sent successfully\n');
						res.sendStatus(200);
					} else {
						//console.log("Error");
						res.sendStatus(500);
					}
					
				}
				
			} catch (err) {
				
				//console.log("Sorry, an err occurred sending email");
				//console.log(err.message);
				console.log(err);
				res.sendStatus(500);
				
			};
			
			
		});
		
	});
	
	
}


