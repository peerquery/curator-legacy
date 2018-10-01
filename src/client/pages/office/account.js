
var reputation = require('../../../utils/reputation.js');

const dsteem = require('dsteem');
const settings = require('../../../../config/settings');
const client = new dsteem.Client(settings.STEEM_RPC);

$( document ).ready(function() {
		
		
    try {
	
        (async () => {
		
	
            const active_user = user_data.username;
            const active_user_authority = user_data.authority;
	
            var curator_account = await Promise.resolve($.get('/api/account/' + active_user));
            var account = curator_account[0];
            //console.log(curator_account);
			
            $('#joined').text(jQuery.timeago(account.created));
            $('#invitor').text(account.invitor);
            $('#email').text(account.email);
            $('#status').text(account.status);
            $('#tag').text(account.tag);
            $('#role').text(account.role);
            $('#curations').text(account.curations);
            $('#rep').html('<span class = \'ui star rating\' data-max-rating=\'5\' data-rating=\'' + get_ratings(account.points) + '\'></span>');
            $('#activity').text(account.activity);
			
            $('#steem').attr('href', 'https://steemit.com/@' + active_user);
            $('#curation').attr('href', '/curator/' + active_user);
		
            var steem_account = await client.database.getAccounts([active_user]);
            steem_account = steem_account[0];
			
            //console.log(steem_account);
			
            $('#mined').text(steem_account.mined);
            $('#id').text(steem_account.id);
            $('#balance').text(steem_account.balance);
            $('#created').text(jQuery.timeago(steem_account.created));
            $('#count').text(steem_account.post_count);
            $('#proxy').text(steem_account.proxy);
            $('#reputation').text(reputation.rep(steem_account.reputation));
            $('#sbd').text(steem_account.sbd_balance);
            $('#recovery').text(steem_account.recovery_account);
			
            //console.log(steem_account)
			
			
            $('.ui.rating')
                .rating('disable')
            ;
			
			
            $('#info_segment').removeClass('loading');
			
			
			
        })();
		
		
    } catch (err){
		
        console.log(err);
		
    }
		
    function get_ratings(score) {
        if (score < 50) return 0;
        else if (score > 50 ) return 1;
        else if (score > 150 ) return 2;
        else if (score > 300 ) return 3;
        else if (score > 500 ) return 4;
        else if (score > 1000 ) return 5;
	
    }
	
	
	
});
	
	