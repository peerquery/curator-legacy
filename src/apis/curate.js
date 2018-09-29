
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

    app.get('/api/private/curate', async function(req, res){
		
        try {
            var sql = 'CALL curate()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err.message);
            res.sendStatus(500);
        }
	
    });
	
	
    app.post('/api/private/approve', async function(req, res){
		
        try {
            var data = [ req.body.author, req.body.title, req.body.url, req.body.curator, req.body.remarks, req.body.state, req.body.rate,  req.body.action ];
            var sql = 'CALL approve(?,?,?,?,?,?,?,?)';
            await pool.query(sql, data);
            res.sendStatus(200);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });
	
	
    app.post('/api/private/reject', async function(req, res){

        try {
            var data = [ req.body.author, req.body.title, req.body.url, req.body.curator, req.body.remarks, req.body.state, req.body.action ];
            var sql = 'CALL reject(?,?,?,?,?,?,?)';
            await pool.query(sql, data);
            res.sendStatus(200);
        }
        catch (err) {
            //console.log(err.message);
            res.sendStatus(500);
        }
			
    });
	
	
	
};
	