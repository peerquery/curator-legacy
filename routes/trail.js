
module.exports = function (app) {

	app.get('/trail', function(req, res){ 
		res.render('trail/trail');
	});


	app.get('/trail/@:author/:permlink', function(req, res){ 
		res.render('trail/viewer');
	});

}