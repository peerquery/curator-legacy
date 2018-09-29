
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

	
	
    app.post('/api/private/add_to_blacklist', async function(req, res){
		
        async function run() {
			
            var data = [ req.body.account, req.body.author, req.body.type, req.body.reason ] ;
			
            try {
                var sql = 'CALL add_to_blacklist(?,?,?,?)';
                await pool.query(sql, data);
                res.sendStatus(200);
            }
            catch (err) {
                console.log(err.message);
                res.sendStatus(500);
            }
			
        }
		
        if (req.body.type == 'out_out') {
            run();
        } else if (req.user.authority == 1 && req.body.type == 'reported') {
            run();
        } else if (req.user.authority == 2 && req.body.type == 'probation'){
            run();
        } else if (req.user.authority == 3 && req.body.type == 'banned'){
            run();
        } else {
            res.status(403).send('You have no such authority');
        }
		
		
    });
		
		
    app.post('/api/private/remove_from_blacklist', async function(req, res){
		
        if (req.user.authority < 3) {
			
            res.status(403).send('You have no such authority');
			
        } else {
			
            var data = [ req.body.account, req.body.author ];
			
            try {
                var sql = 'CALL remove_from_blacklist(?,?)';
                await pool.query(sql, data);
                res.sendStatus(200);
            }
            catch (err) {
                console.log(err.message);
                res.sendStatus(500);
            }
		
        }
		
    });
	
	
    app.get('/api/blacklist_reported', async function(req, res){
			
        try {
            var sql = 'CALL blacklist_reported()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/blacklist_probation', async function(req, res){
			
        try {
            var sql = 'CALL blacklist_probation()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/blacklist_banned', async function(req, res){
			
        try {
            var sql = 'CALL blacklist_banned()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/blacklist_opt_out', async function(req, res){
			
        try {
            var sql = 'CALL blacklist_opt_out()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/blacklist/:offset', async function(req, res){
		
        var data = req.params.offset;
			
        try {
            var sql = 'CALL get_blacklist(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });
	

	
};
	
	