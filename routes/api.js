
'use strict';

var mysql = require('mysql');
var bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
var pool = require('../config/connection');
var email_new_team = require('../src/app/emailer').new;
var email_pass_reset = require('../src/app/emailer').reset;
var email_new_pass = require('../src/app/emailer').new_pass;
const saltRounds = 12;

module.exports = async function (app) {

	app.get('/api', function(req, res){ 
		res.json({status: "OK"});
	});
	
	
	app.get('/api/curate', async function(req, res){
		
		try {
			var sql = "CALL curate()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	
	app.post('/api/approve', async function(req, res){
		
			try {
				var data = [ req.body.author, req.body.title, req.body.url, req.body.curator, req.body.remarks, req.body.state, req.body.rate,  req.body.action ];
				var sql = "CALL approve(?,?,?,?,?,?,?,?)";
				await pool.query(sql, data);
				res.sendStatus(200);
			}
			catch(err) {
				console.log(err.message);
				res.sendStatus(500);
			}
	
	});
	
	
	app.post('/api/reject', async function(req, res){

			try {
				var data = [ req.body.author, req.body.title, req.body.url, req.body.curator, req.body.remarks, req.body.state, req.body.action ];
				var sql = "CALL reject(?,?,?,?,?,?,?)";
				await pool.query(sql, data);
				res.sendStatus(200);
			}
			catch(err) {
				//console.log(err.message);
				res.sendStatus(500);
			}
			
	});
	
	
	app.post('/api/new_team', async function(req, res){
			
		const token = uuidv1();
			
		email_new_team(req.body.account, req.body.email, req.body.role, req.body.message, token ).then(async function (status) {
	
			if (status == "OK") {
				
				//console.log('\n  * team invite email sent successfully\n');
				
				bcrypt.hash(token, saltRounds, async function(err, token_hash) {
				
					try {
						var data = [ req.body.account, req.body.author, req.body.email, req.body.role, req.body.tag, req.body.message, req.body.authority, token_hash ];
						var sql = "CALL new_team(?,?,?,?,?,?,?,?)";
						await pool.query(sql, data);
						res.sendStatus(200);
					}
					catch(err) {
						console.log(err.message);
						res.sendStatus(500);
					}
					
				});
				
			}
	
		}).catch(function (err) {
			//console.log("Sorry, an err occurred sending email");
			console.log(err);
			res.sendStatus(500);
		});
			
			
	});
	
	
	app.post('/api/pass_reset', async function(req, res){
		
		const token = uuidv1();
		
		bcrypt.hash(token, saltRounds, async function(err, token_hash) {
			
			try {
				await pool.query("UPDATE `team` SET `team.`reset_token` = ?, SET `team`.`reset_time` = NOW() WHERE `account` = ?", token_hash, req.body.account);
			} catch(error) {
				console.log(error);
				res.sendStatus(500);
			}
			
			try {
				var status = await email_pass_reset(req.body.account, req.body.email, token);
				if (status == "OK") {console.log('\n  * pass reset email sent successfully\n');	res.sendStatus(200);}
				else {console.log("Error");	res.sendStatus(500);};
			} catch (err) {
				//console.log("Sorry, an err occurred sending email");
				console.log(err);
				res.sendStatus(500);
			};
			
		});
		
			
	});
	
	
	app.post('/api/new_pass', async function(req, res){
		
		try{
			var old_pass_hash = await pool.query("SELECT `password_hash` FROM `team` WHERE `team`.`account` = ? ", req.body.account);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
			return;
		}
			
		var new_pass = req.body.pass;
		
		//check if new pass is same as old
		bcrypt.compare(new_pass, old_pass_hash, async function(err, res) {
			if(res == true) {
				
				console.log('Error: New password same as old password');
				res.sendStatus(500);
				
			} else {
				
				//hash new pass
				bcrypt.hash(new_pass, saltRounds, async function(err, new_pass_hash) {
					
					var data = [ new_pass_hash, req.body.account ];
					
					var sql = "UPDATE `team` SET `team`.`password_hash` = ? WHERE `team`.`account` = ?";
					
					//change password hash in DB
					try {
						await pool.query(sql, data);
					} catch(error) {
						console.log(error);
						res.sendStatus(500);
					}
					
					//send confirmation email to user
					try {
						var status = await email_new_pass(req.body.account, req.body.email);
						if (status == "OK") {console.log('\n  * password reset confirmation email sent successfully\n');res.sendStatus(200); }
						else {	console.log("Sorry, an err occurred sending email");	res.sendStatus(500); };
	
					} catch (err) {
						//console.log("Sorry, an err occurred sending email");
						console.log(err);
						res.sendStatus(500);
					};
					
				})
				
			}
			
		});
	
	});
	
	
	
	app.post('/api/remove_team', async function(req, res){
			
		var data = req.body.account;
			
		try {
			var sql = "CALL remove_team(?)";
			await pool.query(sql, data);
			res.sendStatus(200);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
			
	});
	
	
	
	app.get('/api/team_pending', async function(req, res){
			
		try {
			var sql = "CALL team_pending()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
			
	});
	
	
	
	app.get('/api/team_inactive', async function(req, res){
			
		try {
			var sql = "CALL team_inactive()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
			
	});
	
	
	
	app.get('/api/approved', async function(req, res){
		
		try {
			var sql = "CALL approved()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/ignored', async function(req, res){
		
		try {
			var sql = "CALL ignored()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/lost', async function(req, res){
		
		try {
			var sql = "CALL lost()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/rejected', async function(req, res){
		
		try {
			var sql = "CALL rejected()";
			var results = await pool.query(sql);
			res.json(results[0]);	
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	
	app.get('/api/all_activity', async function(req, res){
		
		try {
			var sql = "CALL all_activity()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/curation_activity', async function(req, res){
		
		try {
			var sql = "CALL curation_activity()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/re_curation_activity', async function(req, res){
		
		try {
			var sql = "CALL re_curation_activity()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/finance_activity', async function(req, res){
		
		try {
			var sql = "CALL finance_activity()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/team_activity', async function(req, res){
		
		try {
			var sql = "CALL team_activity()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/discussions_activity', async function(req, res){
		
		try {
			var sql = "CALL discussions_activity()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	

	
	app.get('/api/team_admins', async function(req, res){
		
		try {
			var sql = "CALL team_admins()";
			var results = await pool.query(sql);
			res.json(results[0]);
			
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	app.get('/api/team_mods', async function(req, res){
		
		try {
			var sql = "CALL team_mods()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	app.get('/api/team_curies', async function(req, res){
		
		try {
			var sql = "CALL team_curies()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
		
	
	
	app.post('/api/add_to_blacklist', async function(req, res){
		
		var data = [ req.body.account, req.body.author, req.body.type, req.body.reason ] ;
			
		try {
			var sql = "CALL add_to_blacklist(?,?,?,?)";
			await pool.query(sql, data);
			res.sendStatus(200);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.post('/api/remove_from_blacklist', async function(req, res){
		
		var data = [ req.body.account, req.body.author ];
			
		try {
			var sql = "CALL remove_from_blacklist(?,?)";
			await pool.query(sql, data);
			res.sendStatus(200);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	

	app.get('/api/blacklist_reported', async function(req, res){
			
		try {
			var sql = "CALL blacklist_reported()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});



	app.get('/api/blacklist_probation', async function(req, res){
			
		try {
			var sql = "CALL blacklist_probation()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});



	app.get('/api/blacklist_banned', async function(req, res){
			
		try {
			var sql = "CALL blacklist_banned()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});



	app.get('/api/blacklist_opt_out', async function(req, res){
			
		try {
			var sql = "CALL blacklist_opt_out()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});


	app.get('/api/blacklist/:offset', async function(req, res){
		
		var data = req.params.offset;
			
		try {
			var sql = "CALL get_blacklist(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});


	app.get('/api/dashboard', async function(req, res){
		
		try {
			var sql = "CALL get_dashboard()";
			var results = await pool.query(sql);
			res.json([results[0], results[1], results[2], results[3], results[4], results[5]]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	
	app.get('/api/bot', async function(req, res){
		
		try {
			var sql = "CALL get_bot()";
			var results = await pool.query(sql);
			res.json([results[0], results[1], results[2]]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	
	
	app.get('/api/settings', async function(req, res){
		
		try {
			var sql = "CALL get_settings()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	

}

