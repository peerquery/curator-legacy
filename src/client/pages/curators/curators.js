
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
        card.href = '/curator/' + data.account;
		
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
		
        var curated = document.createElement('i');
        curated.className = 'balance scale icon';
		
        var curations = document.createElement('span');
        curations.innerText = data.curations + ' curations';
		
        //--
        curation_content.appendChild(curated);
        curation_content.appendChild(curations);
		
		
        var extra_content = document.createElement('div');
        extra_content.className = 'extra content';
		
        var div_rating = document.createElement('div');
        div_rating.className = 'extra';
		
        var ratings_span = document.createElement('span');
        ratings_span.innerText = 'Ratings: ';
		
        var ratings = document.createElement('div');
        ratings.className = 'ui star rating';
        ratings.setAttribute('data-max-rating', '5');
        ratings.setAttribute('data-rating', get_ratings(data.points));
		
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
    $('#new_curators').click(function() {
        get('/api/new_curators/');
    });
	
    $('#top_curators').click(function() {
        get('/api/top_curators/');
    });
	
    $('#inactive_curators').click(function() {
        get('/api/inactive_curators/');
    });
	
    //more btn
    $('#more-btn').click(function() {
        more(this.dataset);
    });
	
    //init
    get('/api/new_curators/');
	
	
    function draw(approved, voted, curies, rejected, div) {
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
		
        //draw for approved
        let angle_approved = approved / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 40, -90 * Math.PI / 180, (angle_approved - 90) * Math.PI / 180);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for voted
        let angle_voted = voted / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 50, -90 * Math.PI / 180, (angle_voted - 90) * Math.PI / 180);
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
		
        //draw for rejected
        let angle_rejected = rejected / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 70, -90 * Math.PI / 180, (angle_rejected - 90) * Math.PI / 180);
        ctx.strokeStyle = 'olive';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '20px arial bold';
        ctx.fillStyle = '#1abc9c';
        ctx.fillText(approved + '%', Width / 2, Height / 2);
	
    }
	
    function percent(value) {
        if (value == 0) return 0;
        return Math.floor((value / total_stats) * 100);
    }
	
	
	
    (async () => {
		
        $.get('/api/curation_stats', function(data, status){
            //console.log(data);
			
            var approved = data[0][0].approved_count.toLocaleString() || 0;
            var voted = data[1][0].voted_count.toLocaleString() || 0;
            var lost = data[2][0].lost_count.toLocaleString() || 0;
            var rejected = data[3][0].rejected_count.toLocaleString() || 0;
			
            total_stats = Number(approved) + Number(voted) + Number(lost) + Number(rejected);
			
            $('#approved').text(approved + ' (' + percent(approved) + '%)');
            $('#voted').text(voted + ' (' + percent(voted) + '%)');
            $('#lost').text(lost + ' (' + percent(lost) + '%)');
            $('#rejected').text(rejected + ' (' + percent(rejected) + '%)');
			
            draw(percent(approved), percent(voted), percent(lost), percent(rejected), 'cvs_stats');
			
            $('#sidebar').show();
		
        }).fail(function() {
		
            alert('Error fetching community stats');
		
        });
		
    })();
	
	
});
  