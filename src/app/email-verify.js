
'use strict'

var transporter = require('./../../config/email');

module.exports = function() {
	
	// verify connection configuration
	transporter.verify(function(error, success) {
		if (error) {
			console.log(error);
		} else {
			console.log('    > email server is also ready!');
		}
	});

};