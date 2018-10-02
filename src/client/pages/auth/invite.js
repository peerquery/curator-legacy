
$( window ).on( 'load', function() {
      
    var urlParams = new URLSearchParams(window.location.search);
    var username = urlParams.get('user');
    var token = urlParams.get('token');
    var email = urlParams.get('email');
      
    $('#username').text(username);  
      
    $('#action').click(function(){
        
        $('form').addClass('loading');
        
        $.post('/invite', { username: username, email: email, token: token }, function(data, status){
            console.log(status);
            if (status == 'success') {
            
                $('form').removeClass('loading');
                $('form').addClass('success');
                $('#action').attr('href', '/set');
                $('#action').text('Set your password');
            
            }
            
        }).fail(function(err) {
        
            console.log(err.statusText);
                
            $('form').removeClass('loading');
            $('form').addClass('error');
            $('#action').attr('href', '/');
            $('#action').text('Return home');
                
        });
        
    });
        
});