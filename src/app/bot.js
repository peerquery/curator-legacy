
'use strict';
require('dotenv').config();
const dsteem = require('dsteem');
const util = require('util');
const mysql = require('mysql');
const settings = require('./../../config/settings');
const pool = require('./../../config/connection');
const client = new dsteem.Client(settings.STEEM_RRC);

module.exports = async function (app) {
	
    //configs
    var bot_resting = false;
    var vote_team = true;
    var vote_project = true;
    var vote_sponsors = false;
	
    //settings
    var curator_rate = 0;
    var team_rate = 0;
    var project_rate = 0;
    var estimate = 0;
    var reward_balance = 0;
    var recent_claims = 0;
    var sbd_median_price = 0;
    var final_vest = 0;
    var voting_power = 0;
    var bot_account = '';
    var bot_holiday = '';
    var common_comment = '';
    var vote_interval_minutes = '';
    var key = '';
	
    var vote_worth = (weight, voting_power, final_vest, recent_claims, reward_balance, sbd_median_price) => {
		
        var power = (voting_power * weight / 10000) / 50;
        var rshares = power * final_vest / 10000;
        var estimates = (rshares / recent_claims * reward_balance * sbd_median_price).toFixed(2);
        return estimates;
		
    };
	
    function today() {
        var d = new Date();
        var weekday = new Array(7);
        weekday[0] = 'sunday';
        weekday[1] = 'monday';
        weekday[2] = 'tuesday';
        weekday[3] = 'wednesday';
        weekday[4] = 'thursday';
        weekday[5] = 'friday';
        weekday[6] = 'saturday';
	
        return weekday[d.getDay()];
    }
	
	
    //ready global configs
    (async () => {
	
        // update the configs every 4 minutes. will reduce server load but result in less accurate(outdated by 4 minutes) vote value/worth calculation
        // this also means that dynamic updating curator, project and team rates will take effect in up to 4 minutes
		
        async function set_globals() {
			
            try {
                //console.log('   fetching globals ');
				
                //get local settings
                var sql = 'CALL vote_settings()';
                var results = await pool.query(sql);
				
				
                results = results[0][0];
				
                //do not vote if today is resting day for bot
                if (results.bot_holiday == today()) bot_resting = true;
				
                curator_rate = results.curator_rate;
                project_rate = results.project_rate;
                team_rate = results.team_rate;
                common_comment = results.common_comment;
                vote_interval_minutes = results.vote_interval_minutes;
                bot_account = results.bot_account;
                bot_holiday = results.bot_holiday;
				
                key = dsteem.PrivateKey.fromLogin(bot_account, process.env.BOT_KEY, 'posting');
		
                //set global steem values
				
				
                var acc = await client.database.getAccounts([bot_account]);
                acc = acc[0];
				
                voting_power = acc.voting_power;
			
                //calculate full vote(weight at 10000) worth
                var fund = await client.database.call('get_reward_fund', ['post']);
                recent_claims = fund.recent_claims ;
                reward_balance = fund.reward_balance.split(' ')[0] ;
				
                var price = await client.database.getCurrentMedianHistoryPrice();
                sbd_median_price = price.base.amount;
			
                var total_vests = Number(acc.vesting_shares.split(' ')[0])  + Number(acc.received_vesting_shares.split(' ')[0])  - Number(acc.delegated_vesting_shares.split(' ')[0] );
                final_vest = total_vests * 1e6;
				
                //console.log(vote_worth(10000, voting_power, final_vest, recent_claims, reward_balance, sbd_median_price));
				
		
            } catch (err) { 
                console.log(err);
            }
			
        }
		
        //this runs only once, set the globals for the first time, activates voting bot systems, then sets timer to periodically get new globals
        try {
		
            await set_globals();
            console.log('        + globals for voting bot are ready');
			
            vote_sys();
			
            console.log('    > voting bot activated!');
		
            var minutes = settings.UPDATE_BOT_GLOBALS_INTERVAL_MINUTES;
            var the_interval = minutes * 60 * 1000;
            setInterval(function(){
                set_globals();
            }, the_interval);
			
        } catch (err){
            console.log(err);
        }
		
    })();
	
	
    //voting system
	
    async function vote_sys() {
	
        //core voter engine module
        async function voter(data, actions, type) {
		
            try {
			
                //set vote details
                var vote = {voter: data.voter, author: data.author, permlink: data.permlink, weight: data.weight};
                //console.log(vote);
			
                //await the vote - unfortunately, if vote fails - the post has already been marked as voted
                var vote_results = await client.broadcast.vote(vote, key);
                //console.log(vote_results);
			
                if (actions == 'vote_comment') {
				
                    //set comment details
                    var comment = { author: data.user, title: '', body: data.body, json_metadata: data.json_metadata, parent_author: data.parent_author, parent_permlink: data.parent_permlink, permlink: data.new_permlink };
                    //console.log(comment);
			
                    //comment
                    try {
					
                        var comment_results = await client.broadcast.comment(comment, key);
                        //console.log(comment_results);
					
                    } catch (e){
					
                        console.log(e);
					
                    }
				
                }
			
                //record activity in db
                try {
				
                    var vote_amount = await vote_worth(data.weight, voting_power, final_vest, recent_claims, reward_balance, sbd_median_price); 
                    var data2 = [ data.author, '/@' + data.author + '/' + data.permlink, data.body, vote_amount, data.permlink, type ];
                    var sql2 = 'CALL bot_activity(?,?,?,?,?,?)';
                    await pool.query(sql2, data2);
				
                } catch (e){
				
                    console.log(e);
				
                }
		
            } catch (err) {
			
                console.log(err.message);
			
            }
		
	
        }
	
	
        //vote curation
        (async () => {
	
            var minutes = vote_interval_minutes;
            var the_interval = minutes * 60 * 1000;
	
            setInterval(async function() {
			
                var actions = 'vote_comment';
			
                //if today is bot resting day, do not vote
                if (bot_resting) return;
			
                try {
                    //fetch posts from DB
                    var sql = 'CALL upvote()';
                    var results = await pool.query(sql);
			
                    //ready results for use
                    results = results[0][0];
				
                    //console.log('-----db results: ', results);
                    if (!results || results == '') return;
				
                    var data = {};
                    var approved = '<b>Approved for ' + results.rate + '% by @' + results.curator + '</b><br/><br/>';
				
                    //set universal variables
                    data.author = results.author;
                    data.voter = bot_account;
                    data.user = bot_account;
                    data.permlink = results.permlink;
                    data.weight = results.rate * 100;
                    data.body = approved + '<b>Remarks</b>: <em>' + results.remarks + '</em><br/><br/>' + common_comment;
                    data.json_metadata = '{"app": "' + settings.PROJECT_NAME + '", "community":"' + settings.PROJECT_COMMUNITY + '"}';
                    data.parent_author = results.author;
                    data.parent_permlink = results.permlink;
                    data.new_permlink = Math.random().toString(36).substring(2);
				
                    voter(data, actions, 'curation');
				
                } catch (err) {
				
                    console.log(err);
				
                }
			
			
            }, the_interval);
	
		
        })();
	
	
	
	
        //vote curators
        (async () => {
	
            var minutes = 1440; //24 hours so curators are voted for once a day
            var the_interval = minutes * 60 * 1000;
	
            setInterval(async function() {
			
                var actions = 'vote';
			
                try {
				
                    //fetch curators of the day from DB
                    var sql = 'CALL curators_activity()';
                    var results = await pool.query(sql);
                    //console.log(results)
			
                    //ready results for use
                    results = results[0];
				
                    //console.log('-----db results: ', results);
                    if (!results || results == '') return;
				
                    for (var x in results) {
				
                        var acc = results[x].curator;
                        var data = {};
			
                        //set universal variables
                        data.author = acc;
                        data.voter = bot_account;
					
                        //get one latest post from the author's blog
                        //the function returns posts by author and re-steemed posts by author so we fetch the last 5 posts
                        var posts = await client.database.getDiscussions('blog', {tag: acc, limit: 5});
                        //console.log(posts)
					
                        //and we filter to get the last one authored by the user
                        var blog = function(posts) {
                            for (var i in posts) {
                                if (posts[i].author == acc) return posts[i];
                            }
                        };
					
                        var post = blog(posts);
                        data.permlink = post.permlink;
					
                        //calculate the vote worth for each curator based on their curation count
                        //then we multiple by 100 since we used curator rate is based on %(100) instead the true 10,000 for 100% weight
                        data.weight = results[x].total_curation * curator_rate * 100;
					
                        voter(data, actions, 'curators');
				
                    }
				
				
                } catch (err) {
				
                    console.log(err);
				
                }
			
			
            }, the_interval);
	
        })();
	
	
        //vote blog of moderators, admins and project
        (async () => {
	
            var minutes = 1440; //24 hours so curators are voted for once a day
            var the_interval = minutes * 60 * 1000;
	
            setInterval(async function() {
			
                //leave no comments after voting
                var actions = 'vote';
			
                try {
                    //fetch posts from DB
                    var sql = 'CALL team_no_curator()';
                    var results = await pool.query(sql);
				
                    //ready results for use
                    results = results[0];
                    //console.log(results);
				
				
                    //add project's blog account to voting list
                    results.push({account: settings.PROJECT_BLOG});
				
                    if (!results || results == '') return;
				
                    for (var x in results) {
					
                        //console.log(results[x].account);
					
                        var acc = results[x].account;
					
                        //get one latest post from the author's blog
                        //the function returns posts by author and re-steemed posts by author so we fetch the last 5 posts
                        var posts = await client.database.getDiscussions('blog', {tag: acc, limit: 5});
					
                        //and we filter to get the last one authored by the user
                        var blog = async function(posts) {
                            for (var i in posts) {
                                if (posts[i].author == acc) return posts[i];
                            }
                        };
					
					
                        var post = await blog(posts);
					
                        if (!post || post == '') continue;
					
					
                        //set universal variables
                        var data = {};
                        data.author = post.author;
                        data.voter = bot_account;
                        data.permlink = post.permlink;
					
					
                        if (results[x].author == settings.PROJECT_BLOG) {
                            data.weight = project_rate * 100;
                        } else {
                            data.weight = team_rate * 100;
                        }
					
                        voter(data, actions, 'project_team');
					
					
                    }
				
				
                } catch (err) {
				
                    console.log(err);
				
                }
			
			
            }, the_interval);
	
        })();
	
	
    }
	
};
