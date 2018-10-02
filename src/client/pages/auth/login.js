$( window ).on( 'load', function() {
     
    $('form').submit(function(e) {
        e.preventDefault();
    });
     
     
    function form_valid() {
        
        var login = $('#email').val();
        var password = $('#password').val();        
        
        if (  login && login.length > 2 && password && password.length > 6  ) {
        
            $('form').removeClass('error');
            return true;
        
        } else {
        
            $('.form').addClass('error');
            return false;
        }
        
    }
     
     
      
    $('.submit').click(function(event){
        event.preventDefault();
        
        $('form').addClass('error');
        
        if ( form_valid() ) {
            
            
            $('form').addClass('loading');
                
            $.post('/login', {email: $('#email').val(), pass: $('#password').val() }, function(data, status){
        
                if (status == 'success'){
                
                    $('form').addClass('success');
                    window.location.href = '/office/dashboard';
                    
                }
            
            }).fail(function(err) {
            
                $('#email').val('');
                $('#password').val('');
                $('form').removeClass('loading');
                $('form').addClass('error');
            
                console.log(err.statusText);
            
            });
        
        }
        
    });
    
    
    
    $('form').click(function() {
        
        window.user_data = '';
        $('#form').removeClass('error');
        
    });
    
    $('.ui.form')
        .form()
    ;
    
    
    
});
