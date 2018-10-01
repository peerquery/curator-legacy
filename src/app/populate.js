
'use strict';
	
const dsteem = require('dsteem');
const settings = require('./../../config/settings');
const source_app = require('./../../config/config').source_app;
const client = new dsteem.Client(settings.STEEM_RPC);
const db_engine = require('./../../config/config').db_engine;
const engine = require('./../../src/db-engines/' + db_engine);

module.exports = function (app) {
	
    const stream = client.blockchain.getOperationsStream({});
	
    // the stream will emit one data event for every operation that happens on the steemit blockchain
    stream.on('data', (operation) => {
	
        const type = operation.op[0];
        const op = operation.op;
        const tx_id = operation.trx_id;
        const block = operation.block;
        const timestamp = operation.timestamp;
		
        try {
            const json_metadata = op[1].json_metadata;
            if (json_metadata && type == 'comment')  engine(op, timestamp);
        } catch (err) {
            //console.log(err);
        }
	
    });
	
	
    console.log('    > ops streamer and db populator is live!');
	
};
