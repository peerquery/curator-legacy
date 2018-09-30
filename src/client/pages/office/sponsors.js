
$( document ).ready(function() {
    
	
    var action = '';
    var index = 0;
    var sponsors_type = '';
	
    const active_user = user_data.username;
    const active_user_authority = user_data.authority;
	
    function active_sponsors() {
	
        sponsors_type = 'active';
		
        $('#message').html('');
        clear_table();
        $('#sponsors_list_segment').addClass('loading');
	
        $.get('/api/active_sponsors', function(data, status){
            if (status == 'success') {
			
                $('#sponsors_list_segment').removeClass('loading');
				
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
	
	
    function inactive_sponsors() {
	
        sponsors_type = 'inactive';
		
        $('#message').html('');
        clear_table();
        $('#sponsors_list_segment').addClass('loading');
	
        $.get('/api/inactive_sponsors', function(data, status){
            if (status == 'success') {
			
                $('#sponsors_list_segment').removeClass('loading');
				
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
		
        var table = document.getElementById('sponsors_list');
	
        var row = table.insertRow(-1);
		
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
		
        cell1.innerHTML = '@' + data.account;
        cell2.innerHTML =  jQuery.timeago(data.created);
        cell3.innerHTML = data.delegation;
        if (sponsors_type == 'inactive' || active_user_authority < 3) { 
            cell4.innerHTML = '';
        } else if (active_user_authority >= 3) {
            cell4.innerHTML = '<botton class=\'circular ui icon 3 mini remove button\' >  <i class=\'icon user times\'></i>  </button>';
        }
		
    }
	
	
	
    function add_sponsor() {
        $('#message').html('');
		
        var new_sponsor_account = $('#new_sponsor_account').val();
        var new_sponsor_link = $('#new_sponsor_link').val();
        var new_sponsor_delegation = $('#new_sponsor_delegation').val();
        var new_sponsor_banner = $('#new_sponsor_banner').val();
        var new_sponsor_message = $('#new_sponsor_message').val();
		
        if (new_sponsor_account == '') $('#new_sponsor_account_field').addClass('error');
        else if (new_sponsor_link == '') $('#new_sponsor_link_field').addClass('error');
        else if (new_sponsor_delegation == '') $('#new_sponsor_delegation_field').addClass('error');
        else if (new_sponsor_banner == '') $('#new_sponsor_banner_field').addClass('error');
        else if (new_sponsor_message == '') $('#new_sponsor_message_field').addClass('error');
        else {
			
            $('#new_sponsor_account_field').removeClass('error');
            $('#new_sponsor_link_field').removeClass('error');
            $('#new_sponsor_delegation_field').removeClass('error');
            $('#new_sponsor_banner_field').removeClass('error');
            $('#new_sponsor_message_field').removeClass('error');
		
            $('#new_sponsor_form').addClass('loading');
            $('.form_inputs').addClass('disabled');
            $('.form .ui.dropdown').addClass('disabled');
			
            $.post('/api/private/add_sponsor',
                {
                    account: new_sponsor_account,
                    author: '',
                    delegation: new_sponsor_delegation,
                    link: (new_sponsor_link.indexOf('://') === -1) ? 'http://' + new_sponsor_link : new_sponsor_link,
                    banner: new_sponsor_banner,
                    message: new_sponsor_message
                },
                function(response, status){
                    $('#new_sponsor_form').removeClass('loading');
                    if (status === 'success') {
                        $('#new_sponsor_form').addClass('success');
					
                        if (sponsors_type == 'active') {
                            let data = {};
                            data.account = new_sponsor_account;
                            data.link = new_sponsor_link;
                            data.created = new Date();
                            data.delegation = new_sponsor_delegation;
						
                            add_row(data); 
                        }
                    } else {
                        $('#new_sponsor_form').addClass('error');
                    }
                });
		
        }
		
    }
	
	
	
    $(document).on('click','.remove',function(){
		
        index = this.parentNode.parentNode.rowIndex;
		
        $('.ui.basic.modal')
            .modal({
                onHide: function(){
                    $('#remove_button').removeClass('disabled');
                }
            })
            .modal('show')
        ;
    });
	
	
	
	
    function remove_sponsor() {
	
        $('#remove_button').addClass('disabled');
		
        var table = document.getElementById('sponsors_list');
		
        var delete_sponsors_account = table.rows[index].cells[0].innerHTML.substring(1);
		
		
        $.post('/api/private/remove_sponsor',
            {
                account: delete_sponsors_account,
                author: ''
            },
            function(data, status){
                if (status === 'success') {
				
                    $('.ui.basic.modal')
                        .modal({
                            onHide: function(){
                                $('#remove_button').removeClass('disabled');
                            }
                        })
                        .modal('hide')
                    ;
				
                    document.getElementById('sponsors_list').deleteRow(index);
				
                } else {
                    alert('Sorry, there was an error. Pease try again.');
                    $('.ui.basic.modal')
                        .modal({
                            onHide: function(){
                                $('#remove_button').removeClass('disabled');
                            }
                        })
                        .modal('hide')
                    ;
                }
            });
	
    }
	
	
	
	
	


    $( '#add' ).click(function() {
	
        $('.new_sponsor.modal').modal({
            onHide: function(){
                $('.ui.dropdown').removeClass('disabled');
                $('.form_inputs').removeClass('disabled');
                $('#new_sponsor_form').attr('class', 'ui form');
                $('form').form('clear');
            }
        }).modal('show');
	
    });
	
	
	
    function clear_table() {
	
        var tableHeaderRowCount = 1;
        var table = document.getElementById('sponsors_list');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
		
    }
	
	
	
    $('.ui.dropdown')
        .dropdown()
    ;
	
	
    active_sponsors();
	
	
    //event listeners
	
    //sponsor listing
    $('#active_sponsors').click(function() {
        active_sponsors();
    });
    $('#inactive_sponsors').click(function() {
        inactive_sponsors();
    });
	
    //sponsor management
    $('#add_button').click(function() {
        add_sponsor();
    });
    $('#remove_button').click(function() {
        remove_sponsor();
    });
	
	
});
	