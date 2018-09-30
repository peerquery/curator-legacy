

const dsteem = require('dsteem');
const client = new dsteem.Client('https://api.steemit.com');
var username = '';
  
	
$.get('/api/bot', function(data, status){
		
    //console.log(data);
		
    $('#project_rate').text(data[0][0].project_rate + '%');
    $('#team_rate').text(data[0][0].team_rate + '%');
    $('#community_rate').text(data[0][0].community_rate + '%');
		
    $('#daily_curation').text(data[0][0].daily_curation);
    $('#total_posts').text(data[1][0].total_posts);
    $('#voted_posts').text(data[2][0].voted_posts);
		
    username = data[0][0].bot_account;
    //username = "minnowsupport";
		
    $('#bot_account').text( '@' + data[0][0].bot_account );
    $('#steemit').attr('href', 'https://steemit.com/@' + data[0][0].bot_account );
    $('#steemd').attr('href', 'https://steemd.com/@' + data[0][0].bot_account );
    $('#steemdb').attr('href', 'https://steemdb.com/@' + data[0][0].bot_account );
		
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
		
        var acc = await client.database.getAccounts([username]);
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
			
        draw(current_voting_power.split('.')[0]);
			
        $('#vp_message').text(current_voting_power + '% - voting power');
	
        //var steemPower = totalVestingFundSteem * (vestingShares / totalVestingShares);
        var steem_power = (t_v_f * (v_s / t_v_s)).toLocaleString();
        //console.log(steem_power);
        $('#steem_power').text(steem_power);
		
        //vesting shares for delegation is => received_vesting_shares.split(' ')[0] - delegated_vesting_shares.split(' ')[0])
        var delegated_steem_power = (t_v_f * ((r_v_s - d_v_s) / t_v_s)).toLocaleString();
        //console.log(delegated_steem_power);
        $('#delegated_sp').text(delegated_steem_power);
			
			
        var follow = await client.call('follow_api', 'get_follow_count', [username]);
        $('#subscribers').text(follow.follower_count);
			
			
        //calculate full vote(weight at 10000) worth
        var fund = await client.database.call('get_reward_fund', ['post']);
        var recent_claims = fund.recent_claims ;
        var reward_balance = fund.reward_balance.split(' ')[0] ;
		
        var price = await client.database.getCurrentMedianHistoryPrice();
        var sbd_median_price = price.base.amount;
        var total_vests = Number(acc.vesting_shares.split(' ')[0])  + Number(acc.received_vesting_shares.split(' ')[0])  - Number(acc.delegated_vesting_shares.split(' ')[0] );
        var final_vest = total_vests * 1e6;
        var power = (acc.voting_power * 10000 / 10000) / 50;
        var rshares = power * final_vest / 10000;
        var estimate = rshares / recent_claims * reward_balance * sbd_median_price;
			
			
        $('#vote_worth').text(estimate.toFixed(2));
			
        $('#main_segment').removeClass('loading');
		
    } catch (err) {
		
        console.log(err);
		
    }
		
		
		
		
    function draw(percent) {
        var width = 300;
        var height = 300;
			
        var canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
		

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
        ctx.strokeStyle = '#0681c4';
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.closePath();
			
        let angle = percent / 100 * 360;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 100, -90 * Math.PI / 180, (angle - 90) * Math.PI / 180);
        ctx.strokeStyle = '#4ac5f8';
        ctx.lineWidth = 20;
        ctx.stroke();
        ctx.closePath();

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '40px arial bold';
        ctx.fillStyle = '#4ac5f8';
        ctx.fillText(percent + '%', width / 2, height / 2);
			
    }
		
		
}
	