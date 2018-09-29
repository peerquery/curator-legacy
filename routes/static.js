
module.exports = function (server) {

    server.get('/', function(req, res){ 
        res.render('static/index');
    });
	
    server.get('/bot', function(req, res){ 
        res.render('static/bot');
    });
	
    server.get('/faqs', function(req, res){ 
        res.render('static/faqs');
    });
	
    server.get('/sponsors', function(req, res){ 
        res.render('static/sponsors');
    });

};