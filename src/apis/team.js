
'use strict';

var mysql = require('mysql');
var bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
var pool = require('./../../config/connection');
var email_new_team = require('../app/emailer').new;
var email_pass_reset = require('../app/emailer').reset;
var email_new_pass = require('../app/emailer').new_pass;
const saltRounds = 12;

module.exports = async function (app) {

    app.post('/api/private/new_team', async function(req, res){
		
		
        if (req.user.authority < 3) {
			
            res.status(403).send('You have no such authority');
			
        } else {
			
            const token = uuidv1();
			
            email_new_team(req.body.account, req.body.email, req.body.role, req.body.message, token ).then(async function (status) {
	
                if (status == 'OK') {
				
                    //console.log('\n  * team invite email sent successfully\n');
				
                    bcrypt.hash(token, saltRounds, async function(err, token_hash) {
				
                        try {
                            var data = [ req.body.account, req.body.author, req.body.email, req.body.role, req.body.tag, req.body.message, req.body.authority, token_hash ];
                            var sql = 'CALL new_team(?,?,?,?,?,?,?,?)';
                            await pool.query(sql, data);
                            res.sendStatus(200);
                        }
                        catch (err) {
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
		
        }
		
    });
	
	
    app.post('/api/private/remove_team', async function(req, res){
		
        if (req.user.authority < 3) {
			
            res.status(403).send('You have no such authority');
			
        } else {
		
            var data = [req.body.account, req.body.author];
			
            try {
                var sql = 'CALL remove_team(?,?)';
                await pool.query(sql, data);
                res.sendStatus(200);
            }
            catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
		
        }
		
    });
	
	
    app.get('/api/team_pending', async function(req, res){
			
        try {
            var sql = 'CALL team_pending()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err.message);
            res.sendStatus(500);
        }
			
    });
	
	
    app.get('/api/team_inactive', async function(req, res){
			
        try {
            var sql = 'CALL team_inactive()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err.message);
            res.sendStatus(500);
        }
			
    });
	
	
	
    app.get('/api/account/:account', async function(req, res){
			
        try {
            var data = req.params.account;
            var sql = 'CALL account(?)';
            var results = await pool.query(sql, data);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
			
    });
	
	
    app.get('/api/wallet/:account', async function(req, res){
			
        try {
            var data = req.params.account;
            var sql = 'CALL wallet(?)';
            var results = await pool.query(sql, data);
            res.json([ results[0], results[1], results[2], results[3] ]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
			
    });
	
    app.get('/api/team_admins', async function(req, res){
		
        try {
            var sql = 'CALL team_admins()';
            var results = await pool.query(sql);
            res.json(results[0]);
			
        }
        catch (err) {
            //console.log(err.message);
            res.sendStatus(500);
        }
	
    });

	
    app.get('/api/team_mods', async function(req, res){
		
        try {
            var sql = 'CALL team_mods()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
	
    });

	
    app.get('/api/team_curies', async function(req, res){
		
        try {
            var sql = 'CALL team_curies()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err.message);
            res.sendStatus(500);
        }
	
    });
		
	
	
	
};
	