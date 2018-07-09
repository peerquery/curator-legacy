
module.exports = function (app) {

	app.get('/curators', function(req, res){ 
		res.render('curators/curators');
	});

	app.get('/curator/:curator', function(req, res){ 
		res.render('curators/curator');
	});


}