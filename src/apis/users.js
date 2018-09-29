
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

	

    app.get('/api/new_users/:offset', async function(req, res){
		
        var data = req.params.offset;
			
        try {
            var sql = 'CALL new_users(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/top_users/:offset', async function(req, res){
		
        var data = req.params.offset;
		
        try {
            var sql = 'CALL top_users(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });


	
};
	
	