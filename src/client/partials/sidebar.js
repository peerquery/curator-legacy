
var page = window.location.pathname;
if (page == '/office/dashboard') $('#dashboard-menu').addClass('active');
if (page == '/office/curation') $('#curation-menu').addClass('active');
if (page == '/office/blacklist') $('#blacklist-menu').addClass('active');
if (page == '/office/sponsors') $('#sponsors-menu').addClass('active');
if (page == '/office/team') $('#team-menu').addClass('active');
if (page == '/office/activity') $('#activity-menu').addClass('active');
if (page.indexOf('/office/discussions') > -1) $('#discussions-menu').addClass('active');
if (page == '/office/settings') $('#settings-menu').addClass('active');
     
$( document ).ready(function() {
     
    $('#user-account-sidebar').text('@' + user_data.username);
    $('#user-role-sidebar').text(user_data.role.toUpperCase());
    $('#user-image-sidebar').attr('src', 'https://steemitimages.com/u/' + user_data.username + '/avatar');
        
});
     
     