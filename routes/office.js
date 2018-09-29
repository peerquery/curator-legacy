

var mysql = require('mysql');
var pool = require('../config/connection');

module.exports = async function (app) {

    app.get('/office', function(req, res){ 
        res.redirect('/office/dashboard');
    });
	
    app.get('/office/dashboard', function(req, res){
        res.render('office/dashboard', { user: req.user} );
    });
	
    app.get('/office/account', function(req, res){ 
        res.render('office/account', { user: req.user} );
    });

    app.get('/office/wallet', function(req, res){ 
        res.render('office/wallet', { user: req.user} );
    });
	
    app.get('/office/team', function(req, res){ 
        res.render('office/team', { user: req.user} );
    });
	
    app.get('/office/curation', function(req, res){ 
        res.render('office/curation', { user: req.user} );
    });

    app.get('/office/blacklist', function(req, res){ 
        res.render('office/blacklist', { user: req.user} );
    });

    app.get('/office/activity', function(req, res){ 
        res.render('office/activity', { user: req.user} );
    });

    app.get('/office/sponsors', function(req, res){ 
        res.render('office/sponsors', { user: req.user} );
    });

    app.get('/office/discussions', function(req, res){ 
        res.render('office/discussions', { user: req.user} );
    });

    app.get('/office/settings', async function(req, res){ 
	
        try {
            var sql = 'CALL get_settings()';
            var results = await pool.query(sql);
            res.render('office/settings', { user: req.user, settings: results[0]} );
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
		
    });


};