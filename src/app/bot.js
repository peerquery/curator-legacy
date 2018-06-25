
'use strict';

require('dotenv').config();
var dsteem = require('dsteem');
var util = require('util');
var mysql = require('mysql');
var pool = require('./../../config/connection');
const client = new dsteem.Client(process.env.STEEM_RPC);

module.exports = async function (app) {
	
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
	var team_rate = '';
	var project_rate = '';
	var common_comment = '';
	var vote_interval_minutes = '';
	var key = '';
	
	var vote_worth = (weight, voting_power, final_vest, recent_claims, reward_balance, sbd_median_price) => {
		
		var power = (voting_power * weight / 10000) / 50;
		var rshares = power * final_vest / 10000;
		var estimates = (rshares / recent_claims * reward_balance * sbd_median_price).toFixed(2);
		return estimates;
		
	};
	
	
	//ready global configs
	(async () => {
	
		// update the configs every 4 minutes. will reduce server load but result in less accurate(outdated by 4 minutes) vote value/worth calculation
		// this also means that dynamic updating curator, project and team rates will take effect in up to 4 minutes
		
		async function set_globals() {
			
			try {
				//console.log('   fetching globals ');
				
				//get local settings
				var sql = "CALL vote_settings()";
				var results = await pool.query(sql);
				
				
				results = results[0][0];
				
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
				
		
			} catch(err) { 
				console.log(err);
			}
			
		}
		
		//this runs only once, set the globals for the first time, activates voting bot systems, then sets timer to periodically get new globals
		try {
		
			await set_globals();
			console.log('        + globals for voting bot are ready');
			
			vote_sys();
			
			console.log("    > voting bot activated!");
		
			var minutes = process.env.UPDATE_BOT_GLOBALS_INTERVAL_MINUTES;
			var the_interval = minutes * 60 * 1000;
			setInterval(function(){
				set_globals()
			}, the_interval);
			
		} catch(err){
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
					
				} catch(e){
					
					console.log(e);
					
				}
				
			}
			
			//record activity in db
			try {
				
				var vote_amount = await vote_worth(data.weight, voting_power, final_vest, recent_claims, reward_balance, sbd_median_price); 
				var data2 = [ data.author, '/@' + data.author + '/' + data.permlink, data.body, vote_amount, data.permlink, type ];
				var sql2 = "CALL bot_activity(?,?,?,?,?,?)"
				await pool.query(sql2, data2);
				
			} catch(e){
				
				console.log(e);
				
			}
		
		} catch(err) {
			
			console.log(err.message);
			
		}
		
	
	}
	
	
	//vote curation
	(async () => {
	
		var minutes = vote_interval_minutes;
		var the_interval = minutes * 60 * 1000;
	
		setInterval(async function() {
			
			var actions = 'vote_comment';
			
			try{
				//fetch posts from DB
				var sql = "CALL upvote()";
				var results = await pool.query(sql);
			
				//ready results for use
				results = results[0][0];
				
				//console.log('-----db results: ', results);
				if (!results) return;
				
				var data = {};
				var approved = "<b>Approved for " + results.rate + "% by @" + results.curator + "</b><br/><br/>";
				
				//set universal variables
				data.author = results.author;
				data.voter = bot_account;
				data.user = bot_account;
				data.permlink = results.permlink;
				data.weight = results.rate * 100;
				data.body = approved + "<b>Remarks</b>: <em>" + results.remarks + "</em><br/><br/>" + common_comment;
				data.json_metadata = '{"app": "' + process.env.PROJECT_NAME + '", "community":"' + process.env.PROJECT_COMMUNITY + '"}';
				data.parent_author = results.author;
				data.parent_permlink = results.permlink;
				data.new_permlink = Math.random().toString(36).substring(2);
				
				voter(data, actions, "curation");
				
			} catch(err) {
				
				console.log(err);
				
			}
			
			
		}, the_interval);
	
		
	})();
		
	
	};
	
};