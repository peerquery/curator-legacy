
'use strict'
 
var fs = require('fs');

exports.engine_sp = fs.readFileSync('./sql/engine.sql').toString();

exports.api_sp = fs.readFileSync('./sql/api.sql').toString();
