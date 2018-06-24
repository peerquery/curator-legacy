
'use strict'

require('dotenv').config();
var pool = require('./../config/connection');
var db_creator = require('./../sql/db-creator');
var sp_creator = require('./../sql/sp-creator');
var settings_creator = require('./../sql/settings-creator');
	
module.exports = async function () {
	
	console.log("\n  * db manager initiated\n");
	
		
	//create tables if they do not already exist
	await pool.query(db_creator.create_db);
	console.log("    > db tables and views ready");
	console.log("    	+ owner account created for USER @" + process.env.OWNER_ACCOUNT + " with EMAIL: " + process.env.OWNER_EMAIL);
		
	
	//drop if exist; create the sp for engines
	await pool.query(sp_creator.engine_sp);
	console.log("    > engine procedures ready");
		
	
	//drop if exist; create settings row
	await pool.query(settings_creator.create_row);
	console.log("        + default settings set up if not exist");
	
	
	//drop if exist; create sp for apis
	await pool.query(sp_creator.api_sp);
	console.log("    > api procedures ready");
		
		
	
};