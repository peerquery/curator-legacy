
module.exports = function (server) {

	server.get('/', function(req, res){ 
		res.render('static/index');
	});
	
	server.get('/sponsors', function(req, res){ 
		res.render('static/sponsors');
	});

}