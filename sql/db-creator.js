
'use strict';

require('dotenv').config();
var fs = require('fs');
var bcrypt = require('bcrypt');

let hash = bcrypt.hashSync(process.env.OWNER_PASS, 12);

var db_tables = fs.readFileSync('./sql/tables.sql').toString();
	
db_tables = db_tables.replace('OWNER_ACCOUNT',  process.env.OWNER_ACCOUNT);
db_tables = db_tables.replace('OWNER_EMAIL',  process.env.OWNER_EMAIL);
db_tables = db_tables.replace('OWNER_PASS', hash );

exports.create_db = db_tables;