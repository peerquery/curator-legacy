
const dsteem = require('dsteem'),
    num2str = require('../../../utils/num2str.js');
const client = new dsteem.Client('https://api.steemit.com');

$( document ).ready(function() {
    
    var bot_account = '';
	
    const active_user = user_data.username;
    const active_user_authority = user_data.authority;	
	
    $.get('/api/dashboard', function(data, status){
		
        //console.log(data);
		
        $('#project_rate').text(data[0][0].project_rate + '%');
        $('#team_rate').text(data[0][0].team_rate + '%');
        $('#community_rate').text(data[0][0].community_rate + '%');
		
        $('#daily_curation').text(data[0][0].daily_curation);
        $('#total_posts').text(data[1][0].total_posts);
        $('#voted_posts').text(data[2][0].voted_posts);
		
        $('#total_team').text(data[3][0].total_team);
        $('#total_sponsors').text(data[4][0].total_sponsors);
        $('#total_members').html(num2str.process(data[5][0].total_members));
		
        bot_account = data[0][0].bot_account;
        cal();
		
    });
	
	
    async function cal() {
	
        try {
		
            var c = await client.database.getConfig();
            //console.log(c);
		
            var dgp = await client.database.getDynamicGlobalProperties();
            var t_v_s = dgp.total_vesting_shares.split(' ')[0];
            var t_v_f = dgp.total_vesting_fund_steem.split(' ')[0];
            //console.log(dgp);
		
            var acc = await client.database.getAccounts([bot_account]);
            acc = acc[0];
            //console.log(acc);
            var l_v_t = acc.last_vote_time;
            var v_p = acc.voting_power;
            var v_s = acc.vesting_shares.split(' ')[0];
            var d_v_s = acc.delegated_vesting_shares.split(' ')[0];
            var r_v_s = acc. received_vesting_shares.split(' ')[0];
		
            //var secondsago = (new Date - new Date(response[0].last_vote_time + "Z")) / 1000;
            var s_a = (new Date() - new Date(l_v_t + 'Z')) / 1000;
		
            //var current voting_power = response[0].voting_power + (10000 * secondsago / 432000);
            var current_voting_power = v_p + (10000 * s_a / 432000);
            current_voting_power = Math.min(current_voting_power / 100, 100).toFixed(2);
            //console.log(c_v_p);
            $('#voting_power').text(current_voting_power + '%');
	
            //var steemPower = totalVestingFundSteem * (vestingShares / totalVestingShares);
            var steem_power = (t_v_f * (v_s / t_v_s)).toLocaleString();
            //console.log(steem_power);
            $('#steem_power').text(steem_power);
		
            //vesting shares for delegation is => received_vesting_shares.split(' ')[0] - delegated_vesting_shares.split(' ')[0])
            var delegated_steem_power = (t_v_f * ((r_v_s - d_v_s) / t_v_s)).toLocaleString();
            //console.log(delegated_steem_power);
            $('#delegated_sp').text(delegated_steem_power);
			
			
            var follow = await client.call('follow_api', 'get_follow_count', [bot_account]);
            $('#subscribers').text(follow.follower_count);
			
            $('#main_segment').removeClass('loading');
            $('#community_segment').show();
		
        } catch (err) {
		
            console.log(err);
		
        }
		
    }
	
	
	
	
});
	