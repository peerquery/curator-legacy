
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {
	
	
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

