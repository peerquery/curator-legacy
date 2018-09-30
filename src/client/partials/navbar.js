
	
if ( typeof user_data == 'object' && user_data ) {
    document.getElementById('office-menu').style.display = 'block';
    var account = user_data.username;
	
    document.getElementById('user-account').innerText = account;
    document.getElementById('user-img').src = 'https://steemitimages.com/u/' + account + '/avatar';
	
} else { 
    document.getElementById('login-menu').style.display = 'block';
}
	