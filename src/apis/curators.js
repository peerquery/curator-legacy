
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

	

    app.get('/api/new_curators/:offset', async function(req, res){
		
        var data = req.params.offset;
			
        try {
            var sql = 'CALL new_curators(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/top_curators/:offset', async function(req, res){
		
        var data = req.params.offset;
		
        try {
            var sql = 'CALL top_curators(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });



    app.get('/api/inactive_curators/:offset', async function(req, res){
		
        var data = req.params.offset;
		
        try {
            var sql = 'CALL inactive_curators(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });


	
};
	
	