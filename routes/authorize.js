
'use strict';

module.exports = function (req, res, next) {
	
    if (!req.user) {
		
        res.redirect('/community');
		
    } else if (req.user && req.user == null) {
		
        res.redirect('/login');
			
    } else {
		
        next();
		
    }

};
