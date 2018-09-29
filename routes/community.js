
module.exports = function (app) {

    app.get('/community', function(req, res){ 
        res.render('community/community');
    });

    app.get('/user/:user', function(req, res){ 
        res.render('community/user');
    });


};