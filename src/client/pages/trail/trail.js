
$( document ).ready(function() {
    
    var mode = '';
    var post_obj = {};
    var total_stats = 0;
	
    function approved() {
		
        mode = 'approved';
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
	
        $.get('/api/approved', function(data, status){
			
            $('#post_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    create_items(data[x]);
                }
					
            }
				
        }).fail(function() {
		
            alert('Err fetching results, please try again');
		
        });
    }
	
	
    function voted() {
	
        mode = 'voted';
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
	
        $.get('/api/voted', function(data, status){
			
            $('#post_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    create_items(data[x]);
                }
					
            }
				
        }).fail(function() {
		
            alert('Err fetching results, please try again');
		
        });
    }
	
	
    function lost() {
	
        mode = 'lost';
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
	
        $.get('/api/lost', function(data, status){
			
            $('#post_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    create_items(data[x]);
                }
					
            }
				
        }).fail(function() {
			
            alert('Err fetching results, please try again');
			
        });
		
    }
	
	
    function rejected() {
	
        mode = 'rejected';
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
	
        $.get('/api/rejected', function(data, status){
			
            $('#post_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    create_items(data[x]);
                }
					
            }
				
        }).fail(function() {
		
            alert('Err fetching results, please try again');
			
        });
    }
	
	
    function create_items(data) {
		
        var item = document.createElement('div');
        item.className = 'item';
        item.id = data.id;
	
        var button = document.createElement('a');
        button.className = 'view-post right floated circular ui icon button';
        button.innerHTML = '<i class=\'icon external alternate\'></i>';
        button.href = '/trail/@' + data.author + '/' + data.permlink;
		
        button.setAttribute('target', '_blank');
		
        var img = document.createElement('img');
        img.className = 'ui avatar image';
        img.src = 'https://steemitimages.com/u/' + data.author + '/avatar';
		
        var content = document.createElement('div');
        content.className = 'content';
		
        var a = document.createElement('a');
        a.className = 'header';
        a.innerHTML = data.title;
        a.href = '/trail/@' + data.author + '/' + data.permlink;
        a.setAttribute('target', '_blank');
		
        var description = document.createElement('div');
        description.className = 'description';
		
        if (mode == 'ignored' || mode == 'lost') {
            description.innerHTML = '<small>Authored by <a target=\'_blank\' href=\'/user/' + data.author + '\'><b>@' + data.author + '</b></a></small>';
        } else {
            description.innerHTML = '<small>Authored by <a target=\'_blank\' href=\'/user/' + data.author + '\'><b>@' + data.author + '</b></a>, curated by <a target=\'_blank\' href=\'/curator/' + data.curator + '\'><b>@' + data.curator + '</b></a> as - <em>' + rate_name(data.rate) + '</em></small>';
        }
		
        content.appendChild(a);
        content.appendChild(description);
		
		
        item.appendChild(button);
        item.appendChild(img);
        item.appendChild(content);
		
		
        document.getElementById('post_list').appendChild(item);
		
    }
	
	
    function rate_name(rate) {
		
        if (rate == '1') return 'Nice';
        else if (rate == '3') return 'Average';
        else if (rate == '5') return 'Interesting';
        else if (rate == '10') return 'Genius';
        else if (rate == '15') return 'Awesome';
        else if (rate == '20') return 'Remarkable';
        else if (rate == '25') return 'Exceptional';
        else if (rate == '30') return 'Outstanding';
        else if (rate == '0') return 'Rejected';
	
    }
	
	
	
    //click event listeners
	
    //menu buttons
    $('#approved_btn').click(function() {
        approved();
    });
	
    $('#voted_btn').click(function() {
        voted();
    });
	
    $('#lost_btn').click(function() {
        lost();
    });
	
    $('#rejected_btn').click(function() {
        rejected();
    });
	
    //init
    approved();
	
	
    function draw(a_count, i_count, l_count, r_count, div) {
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
        let angle_a = a_count / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 40, -90 * Math.PI / 180, (angle_a - 90) * Math.PI / 180);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for blacklist
        let angle_i = i_count / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 50, -90 * Math.PI / 180, (angle_i - 90) * Math.PI / 180);
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for team
        let angle_l = l_count / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 60, -90 * Math.PI / 180, (angle_l - 90) * Math.PI / 180);
        ctx.strokeStyle = 'pink';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
		
        //draw for sponsors
        let angle_r = r_count / 100 * 360;
        ctx.beginPath();
        ctx.arc(Width / 2, Height / 2, 70, -90 * Math.PI / 180, (angle_r - 90) * Math.PI / 180);
        ctx.strokeStyle = 'olive';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '20px arial bold';
        ctx.fillStyle = '#1abc9c';
        ctx.fillText(a_count + '%', Width / 2, Height / 2);
	
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
			
            $('#approved_count').text(approved + ' (' + percent(approved) + '%)');
            $('#voted_count').text(voted + ' (' + percent(voted) + '%)');
            $('#lost_count').text(lost + ' (' + percent(lost) + '%)');
            $('#rejected_count').text(rejected + ' (' + percent(rejected) + '%)');
			
            draw(percent(approved), percent(voted), percent(lost), percent(rejected), 'cvs_curation');
			
            $('#sidebar').show();
		
        }).fail(function() {
		
            alert('Error fetching curation stats');
		
        });
		
    })();
	
	
});
	