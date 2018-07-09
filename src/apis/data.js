
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

	
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
	
	app.get('/api/voted', async function(req, res){
		
		try {
			var sql = "CALL voted()";
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
	
	
	//
	
	app.get('/api/approved/user/:user', async function(req, res){
		
		try {
			var data = req.params.user;
			var sql = "CALL approved_user(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	app.get('/api/voted/user/:user', async function(req, res){
		
		try {
			var data = req.params.user;
			var sql = "CALL voted_user(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/ignored/user/:user', async function(req, res){
		
		try {
			var data = req.params.user;
			var sql = "CALL ignored_user(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/lost/user/:user', async function(req, res){
		
		try {
			var data = req.params.user;
			var sql = "CALL lost_user(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/rejected/user/:user', async function(req, res){
		
		try {
			var data = req.params.user;
			var sql = "CALL rejected_user(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);	
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	
	//
	
	app.get('/api/approved/curator/:curator', async function(req, res){
		
		try {
			var data = req.params.curator;
			var sql = "CALL approved_curator(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	app.get('/api/voted/curator/:curator', async function(req, res){
		
		try {
			var data = req.params.curator;
			var sql = "CALL voted_curator(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});

	app.get('/api/ignored/curator/:curator', async function(req, res){
		
		try {
			var data = req.params.curator;
			var sql = "CALL ignored_curator(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});


	app.get('/api/rejected/curator/:curator', async function(req, res){
		
		try {
			var data = req.params.curator;
			var sql = "CALL rejected_curator(?)";
			var results = await pool.query(sql, data);
			res.json(results[0]);	
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	

	app.get('/api/content/@:author/:permlink', async function(req, res){
		
		try {
			var data = "/@" + req.params.author + "/" + req.params.permlink;
			var sql = "CALL get_content(?)";
			var results = await pool.query(sql, data);
			res.json([results[0], results[1]]);	
		}
		catch(err) {
			//console.log(err.message);
			res.sendStatus(500);
		}
	
	});
	
	
}
	
	