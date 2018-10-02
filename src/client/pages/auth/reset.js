
$( window ).on( 'load', function() {
      
    var set = false;
    
    $('form').submit(function(e) {
        e.preventDefault();
    });
     
    
    function form_valid() {
        
        var reg = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var email = $('#login').val();
        
        if (  email && reg.test(email) ) {
            $('form').removeClass('error');
            $('#input_field').removeClass('error');
            return true;
        
        } else {
            $('.form').addClass('error');
            return false;
        }
        
    }
     
    
    $('.submit').click(function(event){
        event.preventDefault();
        
            
        if (form_valid()) {
      
            $('form').addClass('loading');
            
            $.post('/api/reset', { email: $('#login').val()} , function(data, status) {
            
                $('form').removeClass('loading');
                $('#input_field').hide();
                $('.submit').hide();
                $('.form').addClass('success');
                console.log(status);
                
            
            }).fail(function(err) {
        
                $('form').removeClass('loading');
                $('.form').addClass('error');
                $('#input_field').addClass('error');
                $('#login').val('');
                $('#login').focus();
                console.log(err.statusText);
                
            });
        
        } else {
        
            $('.form').addClass('error');
            $('#input_field').addClass('error');
            $('#login').focus();
        
        }
        
    });
    
      
});

