
'use strict'

var db_setup = require('./sql/db-manager');
var server = require('./src/server');
	
(async function() {
	try {
		await db_setup();
		
		console.log('\n  * db setup successful\n');
		console.log('  * starting main server\n');
		
		server();
		
	} catch (err) {
		console.log(err);
	}
})()