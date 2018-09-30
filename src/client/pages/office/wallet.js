
	
const dsteem = require('dsteem');
const client = new dsteem.Client('https://api.steemit.com');
$( document ).ready(function() {
    
	
    (async () => {
		
        try {
	
            const active_user = user_data.username;
            const active_user_authority = user_data.authority;
	
            var curator_wallet = await Promise.resolve($.get('/api/wallet/' + active_user));
			
            var total_curations = curator_wallet[1][0].total_curations || 0;
            var total_payments = curator_wallet[0][0].total_payments || 0;
            var total_earnings = curator_wallet[2][0].total_earnings || 0;
            var wallet_history = curator_wallet[3] || 0;
			
            $('#total_earned').text(total_earnings);
            $('#total_payments').text(total_payments);
			
            var info = '<b>This week</b>: <em>total of <b>$' + total_earnings + '</b> earned through <b>' + total_payments + '</b> votes for <b>' + total_curations + '</b> curations</em>';
            $('#wallet_info').html(info);
			
            for (var x in wallet_history) {
                add_row(wallet_history[x]);
            }
			
            //console.log(curator_wallet);
            $('#loader').hide();
	
        } catch (err){
	
            console.log(err);
	
        }
	
    })();
	
	
    function add_row(data) {
		
        var table = document.getElementById('table');
	
        var row = table.insertRow(1);
		
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
		
        cell1.innerHTML = data.id;
        cell2.innerHTML = data.vote_amount;
        cell3.innerHTML = '<a target=\'_blank\' href=\'https://steemit.com' + data.url + '\'>' + data.url + '</a>';
        cell4.innerHTML = data.note;
        cell5.innerHTML = jQuery.timeago(data.time);
		
    }
	
	
	
});
	