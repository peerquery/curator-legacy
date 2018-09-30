
//initialize socket.io
//var io = require('socket.io');

var socket = io();
    
$(document).ready(function() {
	
    //first clear all snap messages incase user only freshed page - not reloaded it
    sessionStorage.clear();
	
	
    const active_user = user_data.username;
    const active_user_authority = user_data.authority;
	
	
    var on = '';
    var to = '';
    var n = 0;
	
	
    function public_chat() {
	
        $('#symbols').show();
        on = 'public chat';
        $('#feed').html('');
        $('#m').val('');
        $('#m').attr('placeholder', 'Messages here are visible to all and stored for later retrieval.');
        to = 'all';
		
        $('#feed-area').addClass('loading');
		
        $.get('/api/private/public_discussions/', function(data, status){
            //console.log(data);
			
            for (let x in data) {
                new_post(data[x]);
            }
			
            $('#feed-area').removeClass('loading');
		
        });
		
    }
	
	
    function personal_chat() {
	
        $('#symbols').hide();
        on = 'personal chat';
        $('#feed').html('');
        $('#m').val('');
        $('#m').attr('placeholder', 'Messages are *delivered* only to recipient but are stored. Do: (recipient-username) message...');
        to = 'personal';
		
        $('#feed-area').addClass('loading');
		
        $.get('/api/private/personal_discussions/' + active_user, function(data, status){
            //console.log(data);
			
            for (let x in data) {
                new_post(data[x]);
            }
			
            $('#feed-area').removeClass('loading');
		
        });
		
    }
	
	
    function snap_chat() {
		
        $('#symbols').show();
        on = 'snap chat';
        $('#feed').html('');
        $('#m').val('');
        $('#m').attr('placeholder', 'Messages here are visible to all and are not stored.');
        to = 'all';
		
        $('#feed-area').removeClass('loading');
		
        if (typeof(Storage) !== 'undefined') {
		
            if (n == 0) return;
		
            // Code for localStorage/sessionStorage.
            var i = 0;
			
            while (i < n) {
				
                new_post(JSON.parse(sessionStorage.getItem(i)));
				
                sessionStorage.removeItem(i);
				
                i++;
				
            }
		
		
            $('#feed-area').removeClass('loading');
		
			
        } else {
		
		
            $('#feed-area').removeClass('loading');
		
            new_info('Sorry, your browser does not support HTML5 Session Storage. Past snap messages are lost.');
			
        }
		
		
    }
	
	
		
    jQuery('time.timeago').timeago();
		
		
		
    //register new username
    socket.emit('joined', active_user);
		
		
    //set focus on input box
    $('#m').focus();
		
		
    $('#m').on('keyup', function (event) {
        socket.emit('typing', active_user );
    }); 
		
		
    //publish message
    $('form').submit(function(event){
        event.preventDefault();
			
        if (to == 'all') {
            socket.emit(on, { author: active_user, receiver: to, body: $('#m').val(), created: new Date() } );
            $('#m').val('');
        } else {
				
            var regExp = /\(([^)]+)\)/;
            var ms = $('#m').val();
            var matches = regExp.exec(ms);
            if (!matches) {alert('Please enter the recipient of your personal message at the start of your meassage in parentheses: (receivers-username) message'); return; }
            to = matches[1];
				
            socket.emit(on, { author: active_user, receiver: to, body: $('#m').val(), created: new Date() } );
            $('#m').val('');
        }
			
    });
		
		
    //publish symbol
    $('.symbol.icon').click(function(){
			
        if (to == 'all') {
				
            //console.log(this);
            var el = this.className;
            var sym = '<i class=\'' + el + ' large\'></i>';
            socket.emit(on, { author: active_user, receiver: to, body: sym, created: new Date() } );
			
        } else {
				
            new_info('Sorry, symbols are not supported for personal messages.');
				
        }
			
    });
		
		
    socket.on('private', function(msg) {
        //console.log(msg);
			
        //display message
        new_private(msg);
			
        //scroll screen down to show latest message
        $('.stick').scrollTop(function() { return this.scrollHeight; });
			
    });
		
    socket.on('count', function(msg) {
        //console.log(msg);
			
        //display message
        new_info(msg);
			
        //scroll screen down to show latest message
        $('.stick').scrollTop(function() { return this.scrollHeight; });
			
    });
		
    socket.on('newbie', function(msg) {
        //console.log(msg);
			
        //display message
        new_info(msg);
			
        //scroll screen down to show latest message
        $('.stick').scrollTop(function() { return this.scrollHeight; });
			
    });
		
		
    socket.on('activity', function(msg) {
        //console.log(msg);
			
        //display message
        new_info(msg);
			
        //scroll screen down to show latest message
        $('.stick').scrollTop(function() { return this.scrollHeight; });
			
    });
		
		
    socket.on('typing', function (active_user) {
        $('#status').html('<b>@' + active_user + '</b> is typing...');
        setTimeout(function () {
            $('#status').html('');
        }, 3000);
    });
		
		
    socket.on('public chat', function(msg) {
        //console.log(msg);
        if (on !== 'public chat') {
            var info = 'There\'s a new public from: @' + msg.author + '. Click on the \'Public\' menu to see all public messages.';
				
            new_info(info);
            //scroll screen down to show latest message
            $('.stick').scrollTop(function() { return this.scrollHeight; });
			
            //set focus on input box
            $('#m').focus();
				
        } else {
            //display new message on screen
            new_post(msg);
			
            //scroll screen down to show latest message
            $('.stick').scrollTop(function() { return this.scrollHeight; });
			
            //set focus on input box
            $('#m').focus();
				
        }
    });
		
    socket.on('personal chat', function(msg) {
        //console.log(msg);
        if (on !== 'personal chat') {
            var info = 'You have a new message from: @' + msg.author + '. Click on the \'Personal\' menu to see all your personal messages.';
				
            new_info(info);
            //scroll screen down to show latest message
            $('.stick').scrollTop(function() { return this.scrollHeight; });
			
            //set focus on input box
            $('#m').focus();
				
        } else {
            //display new message on screen
            new_post(msg);
			
            //scroll screen down to show latest message
            $('.stick').scrollTop(function() { return this.scrollHeight; });
			
            //set focus on input box
            $('#m').focus();
				
        }
    });
		
    socket.on('snap chat', function(msg) {
        //console.log(msg);
        if (on !== 'snap chat') {
            var info = 'There\'s a snap message from: @' + msg.author + '. Click on the \'Snap\' menu to see snap messages.';
				
            new_info(info);
            //scroll screen down to show latest message
            $('.stick').scrollTop(function() { return this.scrollHeight; });
			
            //set focus on input box
            $('#m').focus();
				
            //store snap message in session storage
            sessionStorage.setItem(n, JSON.stringify(msg));
				
            n = n + 1;
				
        } else {
				
            //display new message on screen
            new_post(msg);
			
            //scroll screen down to show latest message
            $('.stick').scrollTop(function() { return this.scrollHeight; });
			
            //set focus on input box
            $('#m').focus();
				
        }	
    });
		
		
		
	
	
	
    function new_info(msg) {
	
        var info = document.createElement('div');
        info.className = 'ui icon message';
		
        var i = document.createElement('i');
        i.className = 'info circle icon';
		
        var content = document.createElement('div');
        content.className = 'content';
		
        var header = document.createElement('div');
        header.className = 'header';
        header.innerHTML = msg;
		
        var date = document.createElement('time');
        date.className = 'date timeago';
        date.setAttribute('datetime', jQuery.timeago(new Date()));
        date.innerHTML = ' <i class=\'wait icon\'></i>' + jQuery.timeago(new Date());
		
        content.appendChild(header);
        content.appendChild(date);
		
        info.appendChild(i);
        info.appendChild(content);
		
		
        document.getElementById('feed').appendChild(info);
		
		
    }
	
	
	
    function new_private(msg) {
	
        var info = document.createElement('div');
        info.className = 'ui icon message';
		
        var i = document.createElement('i');
        i.className = 'envelope circle icon';
		
        var content = document.createElement('div');
        content.className = 'content';
		
        var header = document.createElement('div');
        header.className = 'header';
        header.innerHTML = msg;
		
        var date = document.createElement('time');
        date.className = 'date timeago';
        date.setAttribute('datetime', jQuery.timeago(new Date()));
        date.innerHTML = ' <i class=\'wait icon\'></i>' + jQuery.timeago(new Date());
		
        content.appendChild(header);
        content.appendChild(date);
		
        info.appendChild(i);
        info.appendChild(content);
		
		
        document.getElementById('feed').appendChild(info);
		
		
    }
	
	
	
    function new_post(msg) {
	
        var event = document.createElement('div');
        event.className = 'event';
		
        var label = document.createElement('div');
        label.className = 'label';
		
        var img = document.createElement('img');
        img.src = 'https://steemitimages.com/u/' + msg.author + '/avatar';
		
		
        var content = document.createElement('div');
        content.className = 'content';
		
        var summary = document.createElement('div');
        summary.className = 'summary';
		
		
        var a = document.createElement('a');
        a.href = '/@' + msg.author;
        a.innerText = '@' + msg.author;
		
        var date = document.createElement('time');
        date.className = 'date timeago';
        date.setAttribute('datetime', jQuery.timeago(msg.created));
        date.innerText = jQuery.timeago(msg.created);
		
        var description = document.createElement('div');
        description.className = 'description';
        description.innerHTML = msg.body;
		
		
        label.appendChild(img);
		
        summary.appendChild(a);
        summary.appendChild(date);
		
        content.appendChild(summary);
        content.appendChild(description);
		
        event.appendChild(label);
        event.appendChild(content);
		
		
        document.getElementById('feed').appendChild(event);
		
	
    }
	
	
	
	
	
	
    $('#public_c').click(function() {
        public_chat();
    });
	
	
    $('#personal_c').click(function() {
        personal_chat();
    });
	
	
    $('#snap_c').click(function() {
        snap_chat();
    });
	
	
	
	
	
	
	
	
    if (window.location.search) {
	
        var urlParams = new URLSearchParams(window.location.search);
		
        if (urlParams.get('tab') == 'personal') {
			
            $('#personal_c').click();
            on = 'personal chat';
            to = 'personal';
			
        } else {
			
            $('#public_c').click();
            on = 'public chat';
            to = 'all';
			
        }
		
    } else {
		
        $('#public_c').click();
		
    }
	
	
});
	