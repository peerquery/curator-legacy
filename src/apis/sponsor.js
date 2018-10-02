
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {


    app.post('/api/private/add_sponsor', async function(req, res){
		
        if (req.user.authority < 3) {
			
            res.status(403).send('You have no such authority');
			
        } else {
			
            var data = [ req.body.account, req.body.author, req.body.delegation, req.body.link, req.body.banner, req.body.message ] ;
			
            try {
                var sql = 'CALL add_sponsor(?,?,?,?,?,?)';
                await pool.query(sql, data);
                res.sendStatus(200);
            }
            catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
		
        }
		
    });

    app.post('/api/private/remove_sponsor', async function(req, res){
		
        if (req.user.authority < 3) {
			
            res.status(403).send('You have no such authority');
			
        } else {
			
            var data = [ req.body.account, req.body.author ];
			
            try {
                var sql = 'CALL remove_sponsor(?,?)';
                await pool.query(sql, data);
                res.sendStatus(200);
            }
            catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
		
        }
		
    });
	
    app.get('/api/active_sponsors', async function(req, res){
		
        try {
            var sql = 'CALL get_active_sponsors()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });
	
    app.get('/api/inactive_sponsors', async function(req, res){
		
        try {
            var sql = 'CALL get_inactive_sponsors()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });


    app.get('/api/sponsorship', async function(req, res){
		
        try {
            var sql = 'CALL sponsorship()';
            var results = await pool.query(sql);
            res.json([ results[0], results[1], results[2], results[3], results[4] ]);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
	
    });

	

};
	
	