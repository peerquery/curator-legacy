
'use strict';

var mysql = require('mysql');
var pool = require('./../../config/connection');

module.exports = async function (app) {

	
	app.post('/api/private/settings', async function(req, res){
		
		
		if(req.user.authority < 3) {
			
			res.status(403).send("You have no such authority");
			
		} else{
		
			var sql = "";
			var data = req.body.data;
			var setting = req.body.setting;
		
			if(setting == "community_rate") sql = "UPDATE `settings` SET `settings`.`community_rate` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "team_rate") sql = "UPDATE `settings` SET `settings`.`team_rate` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "project_rate") sql = "UPDATE `settings` SET `settings`.`project_rate` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "curator_rate") sql = "UPDATE `settings` SET `settings`.`curator_rate` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "common_comment") sql = "UPDATE `settings` SET `settings`.`common_comment` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "bot_holiday") sql = "UPDATE `settings` SET `settings`.`bot_holiday` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "holiday_days") sql = "UPDATE `settings` SET `settings`.`holiday_days` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "daily_curation") sql = "UPDATE `settings` SET `settings`.`daily_curation` = ? WHERE `settings`.`identifier` = 'settings'";
			if(setting == "vote_interval_minutes") sql = "UPDATE `settings` SET `settings`.`vote_interval_minutes` = ? WHERE `settings`.`identifier` = 'settings'";
		
			try {
				var results = await pool.query(sql, data);
				res.sendStatus(200);
			} catch(err) {
				console.log(err.message);
				res.sendStatus(500);
			}
		
		}
	
	});
	
	
}
	
	