
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

	
	app.post('/api/private/add_discussion', async function(req, res){
		
		try {
			var data = [ req.body.author, req.body.receiver, req.body.text, req.body.type ];
			var sql = "CALL add_discussion(?,?,?,?)";
			await pool.query(sql, data);
			res.sendStatus(200);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	app.get('/api/private/public_discussions', async function(req, res){
		
		try {
			var sql = "CALL public_discussions()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	app.get('/api/private/personal_discussions/:user', async function(req, res){
		
		try {
			var data = req.params.user;
			var sql = "CALL personal_discussions(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});



	app.post('/api/private/add_online', async function(req, res){
		
		try {
			var data = [ req.body.socket_id, req.body.user_name ];
			var sql = "CALL add_online(?,?)";
			await pool.query(sql, data);
			res.sendStatus(200);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	app.get('/api/private/remove_online/:user', async function(req, res){
		
		try {
			var data = req.params.socket_id;
			var sql = "CALL remove_online(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	
	app.get('/api/private/get_online', async function(req, res){
		
		try {
			var sql = "CALL get_online()";
			var results = await pool.query(sql);
			res.json(results[0]);
		}
		catch(err) {
			console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	
	
}
	