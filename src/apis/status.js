
'use strict';

module.exports = async function (app) {

	app.get('/api', function(req, res){ 
		res.json({status: "OK"});
	});

}

