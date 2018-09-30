
const dsteem = require('dsteem'),
    num2str = require('../../../utils/num2str.js');


const client = new dsteem.Client('https://api.steemit.com');

	
$.get('/api/sponsorship', async function(data, status){
    //console.log(data)
		
    for (var x in data[0]) { create_sponsor(data[0][x]); }
    $('#cards_loader').hide();
    var worth = data[4][0].worth;
    if (!worth) worth = 0;
		
    $('#authors').text(data[2][0].authors);
    $('#curations').html(num2str.process(data[1][0].curations));
    $('#worth').text(worth.toLocaleString());
			
    var follow = await client.call('follow_api', 'get_follow_count', [data[3][0].bot_account]);
    $('#achievements_loader').hide();
    $('#achievements').show();
    $('#views').text(follow.follower_count * 5);
		
		
});
	
	
	
function create_sponsor(sponsor) {
		
    var sponsor_card = document.createElement('a');
    sponsor_card.className = 'ui card';
    sponsor_card.href = sponsor.link;
    sponsor_card.setAttribute('target', '_blank');
		
    var img_div = document.createElement('div');
    img_div.className = 'image';
		
    var img = document.createElement('img');
    img.src = sponsor.banner;
		
    var content = document.createElement('div');
    content.className = 'content';
		
    var header = document.createElement('div');
    header.className = 'header';
    header.innerText = '@' + sponsor.account;
		
    var description = document.createElement('div');
    description.className = 'description';
    description.innerText = sponsor.message;
		
    var button = document.createElement('div');
    button.className = 'ui bottom attached button';
		
    var i = document.createElement('i');
    i.className = 'add icon';
		
    var span = document.createElement('span');
    span.innerText = 'Visit';
		
    button.appendChild(i);
    button.appendChild(span);
		
    button.appendChild(i);
    button.appendChild(span);
		
    content.appendChild(header);
    content.appendChild(description);
		
    img_div.appendChild(img);
		
    sponsor_card.appendChild(img_div);
    sponsor_card.appendChild(content);
    sponsor_card.appendChild(button);
		
		
    document.getElementById('cards').appendChild(sponsor_card);
		
}

	
//scroll function
$('.scroll').click(function(event){
    $('html, body').animate({scrollTop: '+=600px'}, 800);
});
	