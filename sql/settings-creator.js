
'use strict';

const settings = require('../config/settings');
const fs = require('fs');

var db_row = fs.readFileSync('./sql/settings.sql').toString();
	
db_row = db_row.replace('COMMUNITY_RATE',  settings.COMMUNITY_RATE);
db_row = db_row.replace('TEAM_RATE',  settings.TEAM_RATE);
db_row = db_row.replace('PROJECT_RATE', settings.PROJECT_RATE);
db_row = db_row.replace('CURATOR_RATE', settings.CURATOR_RATE);
db_row = db_row.replace('COMMON_COMMENT', settings.COMMON_COMMENT);
db_row = db_row.replace('BOT_HOLIDAY', settings.BOT_HOLIDAY);
db_row = db_row.replace('HOLIDAY_DAYS', settings.HOLIDAY_DAYS);
db_row = db_row.replace('DAILY_CURATION', settings.DAILY_CURATION);
db_row = db_row.replace('BOT_ACCOUNT', settings.BOT_ACCOUNT);

exports.create_row = db_row;