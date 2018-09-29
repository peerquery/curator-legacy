
'use strict';

module.exports = function (req, res, next) {
	
    if (!req.user) {
		
        res.status(403).send('You have no such authority');
		
    } else if (req.user && req.user == null) {
		
        res.status(403).send('You have no such authority');
			
    } else {
		
        next();
		
    }

};
