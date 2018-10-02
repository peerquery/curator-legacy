
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {
	

    app.get('/api/community_stats', async function(req, res){
		
        try {
            var sql = 'CALL community_stats()';
            var results = await pool.query(sql);
            res.json([results[0], results[1], results[2], results[3]]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

	
    app.get('/api/curation_stats', async function(req, res){
		
        try {
            var sql = 'CALL curation_stats()';
            var results = await pool.query(sql);
            res.json([results[0], results[1], results[2], results[3]]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

		
    app.get('/api/user_stats/:user', async function(req, res){
		
        try {
            var data = req.params.user;
            var sql = 'CALL user_stats(?)';
            var results = await pool.query(sql, data);
            res.json([results[0], results[1], results[2], results[3]]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

	
		
    app.get('/api/user_rep/:user', async function(req, res){
		
        try {
            var data = req.params.user;
            var sql = 'CALL user_rep(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

	
		
    app.get('/api/curator_rep/:curator', async function(req, res){
		
        try {
            var data = req.params.curator;
            var sql = 'CALL curator_rep(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

	
    app.get('/api/curator_stats/:curator', async function(req, res){
		
        try {
            var data = req.params.curator;
            var sql = 'CALL curator_stats(?)';
            var results = await pool.query(sql, data);
            res.json([results[0], results[1], results[2], results[3]]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

	
};
	
	