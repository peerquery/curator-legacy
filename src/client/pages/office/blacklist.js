
$( document ).ready(function() {
    
    var action = '';
    var index = 0;
    var blacklist_type = '';
	
    const active_user = user_data.username;
    const active_user_authority = user_data.authority;
	
	
    //
    if (active_user_authority == 1 ) {
        $('#probate_option, #ban_option').addClass('disabled');
    } else if (active_user_authority == 2) {
        $('#ban_option').addClass('disabled');
    }
	
	
    function blacklist_reported() {
	
        blacklist_type = 'reported';
		
        $('#message').html('');
        clear_table();
        $('#blacklist_list_segment').addClass('loading');
	
        $.get('/api/blacklist_reported', function(data, status){
			
            $('#blacklist_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    add_row(data[x]);
                }
					
            }
				
        }).fail( function() {
            alert('Err fetching results, please try again');
        });
    }
	
	
    function blacklist_probation() {
	
        blacklist_type = 'probation';
		
        $('#message').html('');
        clear_table();
        $('#blacklist_list_segment').addClass('loading');
	
        $.get('/api/blacklist_probation', function(data, status){
			
            $('#blacklist_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    add_row(data[x]);
                }
					
            }
				
        }).fail(function () {
            alert('Err fetching results, please try again');
        });
    }
	
	
    function blacklist_banned() {
	
        blacklist_type = 'banned';
		
        $('#message').html('');
        clear_table();
        $('#blacklist_list_segment').addClass('loading');
	
        $.get('/api/blacklist_banned', function(data, status){
			
            $('#blacklist_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    add_row(data[x]);
                }
					
            }
			
        }).fail(function() {
            alert('Err fetching results, please try again');
        });
    }
	
	
    function blacklist_opt_out() {
	
        blacklist_type = 'opt_out';
		
        $('#message').html('');
        clear_table();
        $('#blacklist_list_segment').addClass('loading');
	
        $.get('/api/blacklist_opt_out', function(data, status){
			
            $('#blacklist_list_segment').removeClass('loading');
				
            if (data.length == 0) {
					
                $('#message').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
					
            } else {
				
                for (let x in data) {
                    add_row(data[x]);
                }
					
            }
			
        }).fail(function() {
            alert('Err fetching results, please try again');
        });
    }
	
	
	
    function add_row(data) {
	
        var table = document.getElementById('blacklist_list');
	
        var row = table.insertRow(-1);
		
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
		
        cell1.innerHTML = '@' + data.account;
        cell2.innerHTML = data.admitter;
        cell3.innerHTML =  jQuery.timeago(data.date);
        cell4.innerHTML = data.reason;
        if (blacklist_type == 'opt_out' || active_user_authority < 3) { 
            cell5.innerHTML = '';
        } else if (active_user_authority >= 3) {
            cell5.innerHTML = '<button class=\'circular ui icon remove 3 mini button\'>  <i class=\'icon user times\'></i>  </button>';
        }
		
		
    }
	
	
	
    function add_blacklist() {
        $('#message').html('');
		
        var new_blacklist_account = $('#new_blacklist_account').val();
        var new_blacklist_type = $('#new_blacklist_type').dropdown('get value');
        var new_blacklist_reason = $('#new_blacklist_reason').val();
		
        if (new_blacklist_account == '') $('#new_blacklist_account_field').addClass('error');
        else if (new_blacklist_type == '') $('#new_blacklist_type_field').addClass('error');
        else if (new_blacklist_reason == '') $('#new_blacklist_reason_field').addClass('error');
        else {
			
            $('#new_blacklist_account_field').removeClass('error');
            $('#new_blacklist_type_field').removeClass('error');
            $('#new_blacklist_reason_field').removeClass('error');
		
            $('#new_blacklist_form').addClass('loading');
            $('.form_inputs').addClass('disabled');
            $('.form .ui.dropdown').addClass('disabled');
			
            $.post('/api/private/add_to_blacklist',
                {
                    account: new_blacklist_account,
                    author: active_user,
                    type: new_blacklist_type,
                    reason: new_blacklist_reason
                },
                function(response, status){
                    $('#new_blacklist_form').removeClass('loading');
                    $('#new_blacklist_form').addClass('success');
					
                    if (blacklist_type == new_blacklist_type) {
                        let data = {};
                        data.account = new_blacklist_account;
                        data.type = new_blacklist_type;
                        data.date = new Date();
                        data.admitter = active_user;
                        data.reason = new_blacklist_reason;
						
                        add_row(data); 
                    }
                }).fail(function () {
                $('#new_blacklist_form').addClass('error');
            });
		
        }
		
    }
	
	
	
    function remove_blacklist() {
	
        $('#remove_btn').addClass('disabled');
		
        var table = document.getElementById('blacklist_list');
		
        var delete_blacklist_account = table.rows[index].cells[0].innerHTML.substring(1);
		
        $.post('/api/private/remove_from_blacklist',
            {
                account: delete_blacklist_account,
                author: active_user
            },
            function(data, status){
				
                $('.ui.basic.modal')
                    .modal({
                        onHide: function(){
                            $('#remove_btn').removeClass('disabled');
                        }
                    })
                    .modal('hide')
                ;
				
                document.getElementById('blacklist_list').deleteRow(index);
				
			
            }).fail( function() {
            alert('Sorry, there was an error. Pease try again.');
            $('.ui.basic.modal')
                .modal({
                    onHide: function(){
                        $('#remove_btn').removeClass('disabled');
                    }
                })
                .modal('hide')
            ;
        });
	
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
	


    $( '#add' ).click(function() {
	
        $('.new_blacklist.modal').modal({
            onHide: function(){
                $('.ui.dropdown').removeClass('disabled');
                $('#new_blacklist_type').dropdown('clear');
                $('.form_inputs').removeClass('disabled');
                $('#new_blacklist_form').attr('class', 'ui form');
                $('form').form('clear');
            }
        }).modal('show');
	
    });
	
	
	
    function clear_table() {
	
        var tableHeaderRowCount = 1;
        var table = document.getElementById('blacklist_list');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
		
    }
	
	
	
    $('.ui.dropdown')
        .dropdown()
    ;
	
	
	
    blacklist_reported();
	
	
    //click event listeners
    $('#blacklist_reported').click(function() {
        blacklist_reported();
    });
	
    $('#blacklist_probation').click(function() {
        blacklist_probation();
    });
	
    $('#blacklist_banned').click(function() {
        blacklist_banned();
    });
	
    $('#blacklist_opt_out').click(function() {
        blacklist_opt_out();
    });
	
    $('#add_blacklist').click(function() {
        add_blacklist();
    });
	
    $('#remove_blacklist').click(function() {
        remove_blacklist();
    });
	
	
});

