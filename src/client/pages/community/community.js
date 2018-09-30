
$( document ).ready(function() {
    
    var offset = 0;
    var menu = '';
    var total_stats = 0;
	
	
    function get(api) {
	
        offset = 0;
        $('#users_list').html('');
        $('#more-btn').hide();
        $('#users_segment').addClass('loading');
        $('#more-btn').attr('data-api', api);
        $('#more-btn').attr('data-offset', 20);
		
        load(api);
		
    }
	
	
    function more(dataset) {
	
        offset = $('#more-btn').data('offset') + 20;
        var api = $('#more-btn').data('api');
        $('#users_list').html('');
        $('#more-btn').hide();
        $('#users_segment').addClass('loading');
        $('#more-btn').attr('data-api', api);
        $('#more-btn').attr('data-offset', offset);
		
        load(api);
	
    }
	
	
    function load(api) {
		
        $.get(api + offset, function(data, status){
			
            $('#users_segment').removeClass('loading');
            //console.log(data);
				
				
            if (!data || data == '') {
					
                $('#users_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                if (data.length > 19) $('#more-btn').show();
				
                offset = offset + data.length;
					
                for (let x in data) {
                    create_users(data[x]);
                }
					
                $('.ui.rating')
                    .rating('disable')
                ;
	
                $('.special.cards .image').dimmer({
                    on: 'hover'
                });
            }
				
        }).fail(function() {
		
            alert('Err fetching results, please try again');
		
        });
    }
	
	
    function create_users(data) {
		
        var card = document.createElement('a');
        card.className = 'card';
        card.href = '/user/' + data.account;
		
        var header_content = document.createElement('div');
        header_content.className = 'content';
	
        var history = document.createElement('div');
        history.className = 'right floated meta';
	
        var history_i = document.createElement('i');
        history_i.className = 'history icon';
	
        var history_span = document.createElement('span');
        history_span.innerText = jQuery.timeago(data.created);

        //
        history.appendChild(history_i);
        history.appendChild(history_span);

		
        var img = document.createElement('img');
        img.className = 'ui avatar image';
        img.src = 'https://steemitimages.com/u/' + data.account + '/avatar';
		
		
        var author_span = document.createElement('span');
        author_span.innerText = '@' + data.account;
		
		
        //--
        header_content.appendChild(history);
        header_content.appendChild(img);
        header_content.appendChild(author_span);
		
		
        var points_span = document.createElement('span');
        points_span.innerText = '(' + data.score + ')';
		
        var curation_content = document.createElement('div');
        curation_content.className = 'content';
		
        var rejected_span = document.createElement('span');
        rejected_span.className = 'right floated';
		
        var rejected_i = document.createElement('i');
        rejected_i.className = 'red times icon';
		
        var rejected_count = document.createElement('span');
        rejected_count.innerText = data.rejected + ' rej.';
		
        //--
        rejected_span.appendChild(rejected_i);
        rejected_span.appendChild(rejected_count);
		
        curation_content.appendChild(rejected_span);
		
		
        var approved_i = document.createElement('i');
        approved_i.className = 'green check icon';
		
        var approved_count = document.createElement('span');
        approved_count.innerText = data.approved + ' pass';
		
        //--
        curation_content.appendChild(approved_i);
        curation_content.appendChild(approved_count);
		
		
        var extra_content = document.createElement('div');
        extra_content.className = 'extra content';
		
        var div_rating = document.createElement('div');
        div_rating.className = 'extra';
		
        var ratings_span = document.createElement('span');
        ratings_span.innerText = 'Ratings: ';
		
        var ratings = document.createElement('div');
        ratings.className = 'ui star rating';
        ratings.setAttribute('data-max-rating', '5');
        ratings.setAttribute('data-rating', get_ratings(data.score));
		
        //--
        div_rating.appendChild(ratings_span);
        div_rating.appendChild(ratings);
		
        extra_content.appendChild(div_rating);
		
        //--
        card.appendChild(header_content);
        card.appendChild(curation_content);
        card.appendChild(extra_content);
		
        document.getElementById('users_list').appendChild(card);
		
    }
	
	
    function get_ratings(score) {
        if (score < 50) return 0;
        else if (score > 50 ) return 1;
        else if (score > 150 ) return 2;
        else if (score > 300 ) return 3;
        else if (score > 500 ) return 4;
        else if (score > 1000 ) return 5;
	
    }
	
	
	
    //click event listeners
	
    //menu buttons
    $('#new_users').click(function() {
        get('/api/new_users/');
    });
	
    $('#top_users').click(function() {
        get('/api/top_users/');
    });
	
    //more btn
    $('#more-btn').click(function() {
        more(this.dataset);
    });
	
    //init
    get('/api/new_users/');
	
	
    function draw(users, b_list, curies, sponsors, div) {
        var canvas = document.getElementById(div);
		
        const Width = 150;
        const Height = 150;
        
        canvas.width = 150;
        canvas.height = 150;
        
        var ctx = canvas.getContext('2d');
		
        //draw for total_stats
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 30, 0, Math.PI * 2);
        ctx.strokeStyle = '#1abc9c';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for users
        let angle_user = users / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 40, -90 * Math.PI / 180, (angle_user - 90) * Math.PI / 180);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for blacklist
        let angle_b = b_list / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 50, -90 * Math.PI / 180, (angle_b - 90) * Math.PI / 180);
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for team
        let angle_curies = curies / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 60, -90 * Math.PI / 180, (angle_curies - 90) * Math.PI / 180);
        ctx.strokeStyle = 'pink';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for sponsors
        let angle_sponsors = sponsors / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 70, -90 * Math.PI / 180, (angle_sponsors - 90) * Math.PI / 180);
        ctx.strokeStyle = 'olive';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '20px arial bold';
        ctx.fillStyle = '#1abc9c';
        ctx.fillText(users + '%', Width / 2, Height / 2);
	
    }
	
    function percent(value) {
        if (value == 0) return 0;
        return Math.floor((value / total_stats) * 100);
    }
	
	
	
    (async () => {
		
        $.get('/api/community_stats', function(data, status){
            //console.log(data);
			
            var users = data[0][0].user_count.toLocaleString() || 0;
            var blacklisted = data[1][0].blacklist_count.toLocaleString() || 0;
            var curators = data[2][0].curator_count.toLocaleString() || 0;
            var sponsors = data[3][0].sponsors_count.toLocaleString() || 0;
			
            total_stats = Number(users) + Number(blacklisted) + Number(curators) + Number(sponsors);
			
            $('#users').text(users + ' (' + percent(users) + '%)');
            $('#blacklisted').text(blacklisted + ' (' + percent(blacklisted) + '%)');
            $('#curators').text(curators + ' (' + percent(curators) + '%)');
            $('#sponsors').text(sponsors + ' (' + percent(sponsors) + '%)');
			
            draw(percent(users), percent(blacklisted), percent(curators), percent(sponsors), 'cvs_stats');
			
            $('#sidebar').show();
		
        }).fail(function() {
		
            alert('Error fetching community stats');
		
        });
		
    })();
	
	
});
  