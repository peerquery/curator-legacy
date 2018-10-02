
$( window ).on( 'load', function() {
    
    var set = false;
    
    $('form').submit(function(e) {
        e.preventDefault();
    });
     
    
    function form_valid() {
        
        var password = $('#password').val();        
        
        if (  password && password.length > 6  ) {
        
            $('form').removeClass('error');
            return true;
        
        } else {
        
            $('.form').addClass('error');
            return false;
        }
        
    }
     
    
      
    $('.submit').click(function(event){
        event.preventDefault();
        
            
        if (set) {
            
            window.location.href = '/login';
            
        } else if (!set && form_valid()) {
    
            $('form').addClass('loading');
            
                
            $.post('/set', { password: $('#password').val()} , function(data, status){
        
                
                $('form').removeClass('loading');
                $('form').addClass('success');
                $('#input').hide();
                $('#action').text('Log in to your account');
                set = true;
            
            
            }).fail(function(err) {
        
                console.log(err);
                console.log(err.statusText);
                
                $('form').removeClass('loading');
                $('form').addClass('error');
                $('#action').attr('href', '/');
                $('#action').text('Return home');
                
            });
        
        }
        
    });
    
    
});
