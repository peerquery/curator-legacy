
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {
	
    app.get('/api/all_activity', async function(req, res){
		
        try {
            var sql = 'CALL all_activity()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err);
            res.sendStatus(500);
        }
	
    });

    app.get('/api/curation_activity', async function(req, res){
		
        try {
            var sql = 'CALL curation_activity()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err);
            res.sendStatus(500);
        }
	
    });

    app.get('/api/re_curation_activity', async function(req, res){
		
        try {
            var sql = 'CALL re_curation_activity()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err);
            res.sendStatus(500);
        }
	
    });

    app.get('/api/finance_activity', async function(req, res){
		
        try {
            var sql = 'CALL finance_activity()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err);
            res.sendStatus(500);
        }
	
    });

    app.get('/api/team_activity', async function(req, res){
		
        try {
            var sql = 'CALL team_activity()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err);
            res.sendStatus(500);
        }
	
    });

    app.get('/api/discussions_activity', async function(req, res){
		
        try {
            var sql = 'CALL discussions_activity()';
            var results = await pool.query(sql);
            res.json(results[0]);
        }
        catch (err) {
            //console.log(err);
            res.sendStatus(500);
        }
	
    });
	

	
};
	