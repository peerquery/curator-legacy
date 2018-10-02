
'use strict';

//config
var config = require('./../../config/config');
var pool = require('./../../config/connection');

module.exports = async function (op, timestamp) {
	
    if (op[1].parent_author === '') {  // check if its a post - not a comment
		
        try {
            var post_app = JSON.parse(op[1].json_metadata).app;
	
            if (post_app.indexOf(config.target) == -1) {
			
                try {
                    var sql = 'CALL new_post(?,?,?,?,?,?,?)';
					
                    var details =  [ op[1].author, op[1].permlink, op[1].parent_permlink, op[1].title, op[1].body, ('/@' + op[1].author + '/' + op[1].permlink), timestamp ];
					
                    await pool.query(sql, details);
					
                }
                catch (err) {
                    console.log(err.message);
                }
			
            }
        }
        catch (err) {
            console.log(err.message); //silence this error since technically its not an err - not all posts have 'app' value in their json_metadata
        }
    }
	
};



