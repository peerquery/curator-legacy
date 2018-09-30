
$( document ).ready(function() {
	
    var action = '';
    var index = 0;
    var team_type = '';
	
    const active_user = user_data.username;
    const active_user_authority = user_data.authority;
	
	
    function team_admins() {
	
        team_type = 'admin';
		
        $('#message').html('');
        clear_table();
        $('#team_list_segment').addClass('loading');
	
        $.get('/api/team_admins', function(data, status){
            if (status == 'success') {
			
                $('#team_list_segment').removeClass('loading');
				
                if (data.length == 0) {
					
                    $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
                } else {
				
                    for (let x in data) {
                        add_row(data[x]);
                    }
					
                }
				
            } else {
                alert('Err fetching results, please try again');
            }
        });
    }
	
    function team_mods() {
	
        team_type = 'moderator';
	
        $('#message').html('');
        clear_table();
        $('#team_list_segment').addClass('loading');
	
        $.get('/api/team_mods', function(data, status){
            if (status == 'success') {
			
                $('#team_list_segment').removeClass('loading');
				
                if (data.length == 0) {
					
                    $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
                } else {
				
                    for (let x in data) {
                        add_row(data[x]);
                    }
					
                }
				
            } else {
                alert('Err fetching results, please try again');
            }
        });
    }
	
    function team_curies() {
	
        team_type = 'curator';
	
        $('#message').html('');
        clear_table();
        $('#team_list_segment').addClass('loading');
	
        $.get('/api/team_curies', function(data, status){
            if (status == 'success') {
			
                $('#team_list_segment').removeClass('loading');
				
                if (data.length == 0) {
					
                    $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
                } else {
				
                    for (let x in data) {
                        add_row(data[x]);
                    }
					
                }
				
            } else {
                alert('Err fetching results, please try again');
            }
        });
    }
	
    function team_pending() {
	
        team_type = 'pending';
	
        $('#message').html('');
        clear_table();
        $('#team_list_segment').addClass('loading');
	
        $.get('/api/team_pending', function(data, status){
            if (status == 'success') {
			
                $('#team_list_segment').removeClass('loading');
				
                if (data.length == 0) {
					
                    $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
                } else {
				
                    for (let x in data) {
                        add_row(data[x]);
                    }
					
                }
				
            } else {
                alert('Err fetching results, please try again');
            }
        });
    }
	
    function team_inactive() {
	
        team_type = 'inactive';
	
        $('#message').html('');
        clear_table();
        $('#team_list_segment').addClass('loading');
	
        $.get('/api/team_inactive', function(data, status){
            if (status == 'success') {
			
                $('#team_list_segment').removeClass('loading');
				
                if (data.length == 0) {
					
                    $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
                } else {
				
                    for (let x in data) {
                        add_row(data[x]);
                    }
					
                }
				
            } else {
                alert('Err fetching results, please try again');
            }
        });
    }
	
	
	
    function add_row(data) {
		
        var table = document.getElementById('team_list');
	
        var row = table.insertRow(-1);
		
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
		
        cell1.innerHTML = '@' + data.account;
        cell2.innerHTML = data.email;
        cell3.innerHTML =  jQuery.timeago(data.created);
        cell4.innerHTML = data.status;
        cell5.innerHTML = data.tag;
        if (team_type == 'inactive' || active_user_authority < 3) { 
            cell6.innerHTML = '';
        } else if (active_user_authority >= 3) {
            cell6.innerHTML = '<botton class=\'circular ui icon mini remove button\'>  <i class=\'icon user times\'></i>  </button>';
        }
		
    }
	
	
	
    function add_team() {
        $('#message').html('');
		
        var new_team_account = $('#new_team_account').val();
        var new_team_email = $('#new_team_email').val();
        var new_team_role = $('#new_team_role').dropdown('get value');
        var new_team_tag = $('#new_team_tag').val();
        var new_team_message = $('#new_team_message').val();
        var new_team_authority = get_new_team_authority(new_team_role);
		
        if (new_team_account == '') $('#new_team_account_field').addClass('error');
        else if (new_team_email == '') $('#new_team_email_field').addClass('error');
        else if (new_team_role == '') $('#new_team_role_field').addClass('error');
        else if (new_team_tag == '') $('#new_team_tag_field').addClass('error');
        else if (new_team_message == '') $('#new_team_message_field').addClass('error');
        else {
			
            $('#new_team_account_field').removeClass('error');
            $('#new_team_email_field').removeClass('error');
            $('#new_team_role_field').removeClass('error');
            $('#new_team_tag_field').removeClass('error');
            $('#new_team_message_field').removeClass('error');
		
            $('#new_team_form').addClass('loading');
            $('.form_inputs').addClass('disabled');
            $('.form .ui.dropdown').addClass('disabled');
			
            $.post('/api/private/new_team',
                {
                    account: new_team_account,
                    author: active_user,
                    email: new_team_email,
                    role: new_team_role,
                    tag: new_team_tag,
                    message: new_team_message,
                    authority: new_team_authority
                },
                function(response, status){
                    $('#new_team_form').removeClass('loading');
                    if (status === 'success') {
                        $('#new_team_form').addClass('success');
					
                        if (team_type == 'pending') {
                            let data = {};
                            data.account = new_team_account;
                            data.email = new_team_email;
                            data.created = new Date();
                            data.tag = new_team_tag;
                            data.status = 'pending';
						
                            add_row(data); 
                        }
                    } else {
                        $('#new_team_form').addClass('error');
                    }
                });
		
        }
		
    }
	
	
    $(document).on('click','.remove',function(){
		
        index = this.parentNode.parentNode.rowIndex;
		
        $('.ui.basic.modal')
            .modal({
                onHide: function(){
                    $('#remove_btn').removeClass('disabled');
                }
            })
            .modal('show')
        ;
    });
	
	
	
    function get_new_team_authority(role) {
        if (role == 'admin') return 3;
        else if (role == 'moderator') return 2;
        else if (role == 'curator') return 1;
    }
	
	
    function remove_team() {
	
        $('#remove_btn').addClass('disabled');
		
        var table = document.getElementById('team_list');
		
        var delete_team_account = table.rows[index].cells[0].innerHTML.substring(1);
		
		
        $.post('/api/private/remove_team',
            {
                account: delete_team_account,
                author: active_user
            },
            function(data, status){
                if (status === 'success') {
				
                    $('.ui.basic.modal')
                        .modal({
                            onHide: function(){
                                $('#remove_btn').removeClass('disabled');
                            }
                        })
                        .modal('hide')
                    ;
				
                    document.getElementById('team_list').deleteRow(index);
				
                } else {
                    alert('Sorry, there was an error. Pease try again.');
                    $('.ui.basic.modal')
                        .modal({
                            onHide: function(){
                                $('#remove_btn').removeClass('disabled');
                            }
                        })
                        .modal('hide')
                    ;
                }
            });
	
    }
	
	
	
    team_admins();
	


    $( '#add' ).click(function() {
	
        $('.new_team.modal').modal({
            onHide: function(){
                $('.ui.dropdown').removeClass('disabled');
                $('#new_team_role').dropdown('clear');
                $('.form_inputs').removeClass('disabled');
                $('#new_team_form').attr('class', 'ui form');
                $('form').form('clear');
            }
        }).modal('show');
	
    });
	
	
	
    function clear_table() {
	
        var tableHeaderRowCount = 1;
        var table = document.getElementById('team_list');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
		
    }
	
	
    //set up click event listeners
	
    $('#team_admins').click(function() {
        team_admins();
    });
	
    $('#team_mods').click(function() {
        team_mods();
    });
	
    $('#team_curies').click(function() {
        team_curies();
    });
	
    $('#team_pending').click(function() {
        team_pending();
    });
	
    $('#team_inactive').click(function() {
        team_inactive();
    });
	
    //
    $('#add_team').click(function() {
        add_team();
    });
	
    $('#remove_team').click(function() {
        remove_team();
    });
	
	

});
	
	
$('.ui.dropdown')
    .dropdown()
;
	
	