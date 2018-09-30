
'use strict';
	
const dsteem = require('dsteem');
var dotvenv = require('dotenv');
var source_app = require('./../../config/config').source_app;
const steem = new dsteem.Client(process.env.STEEM_RPC);
var db_engine = require('./../../config/config').db_engine;
var engine = require('./../../src/db-engines/' + db_engine);

module.exports = function (app) {
	
    const stream = steem.blockchain.getOperationsStream({});
	
    // the stream will emit one data event for every operation that happens on the steemit blockchain
    stream.on('data', (operation) => {
	
        var type = operation.op[0];
        var op = operation.op;
        var tx_id = operation.trx_id;
        var block = operation.block;
        var timestamp = operation.timestamp;
		
        try {
            var json_metadata = op[1].json_metadata;
            if (json_metadata && type == 'comment')  engine(op, timestamp);
        } catch (err) {
            //console.log(err);
        }
	
    });
	
	
    console.log('    > ops streamer and db populator is live!');
	
};
