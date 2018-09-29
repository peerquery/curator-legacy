
'use strict';

require('dotenv').config();
var fs = require('fs');

var db_row = fs.readFileSync('./sql/settings.sql').toString();
	
db_row = db_row.replace('COMMUNITY_RATE',  process.env.COMMUNITY_RATE);
db_row = db_row.replace('TEAM_RATE',  process.env.TEAM_RATE);
db_row = db_row.replace('PROJECT_RATE', process.env.PROJECT_RATE);
db_row = db_row.replace('CURATOR_RATE', process.env.CURATOR_RATE);
db_row = db_row.replace('COMMON_COMMENT', process.env.COMMON_COMMENT);
db_row = db_row.replace('BOT_HOLIDAY', process.env.BOT_HOLIDAY);
db_row = db_row.replace('HOLIDAY_DAYS', process.env.HOLIDAY_DAYS);
db_row = db_row.replace('DAILY_CURATION', process.env.DAILY_CURATION);
db_row = db_row.replace('BOT_ACCOUNT', process.env.BOT_ACCOUNT);

exports.create_row = db_row;