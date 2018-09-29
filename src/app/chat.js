

var mysql = require('mysql');
var pool = require('./../../config/connection');


module.exports = async function(io) {
	
	
    io.on('connection', async function(socket){
        //console.log('a user connected with id: ', socket.id);
	
        //when a new user joins - add to online in db, welcome them and then notify others
        socket.on('joined', async function(username) {
            socket.username = username;
			
            try {
                var data = [socket.id, username];
                var sql = 'CALL add_online(?,?)';
                await pool.query(sql, data);
            } catch (error) {
                console.log(error);
                //more error functions here
            } finally {
                io.to(socket.id).emit('private', 'Welcome <b>@' + username + '</b>, you\'ve just joined <b>' + (io.engine.clientsCount - 1) + '</b> more user(s) ' );
                socket.broadcast.emit('newbie', '<b>@' + username + '</b> has joined the conversation');
            }
			
        });
	
	
        //when a user is typing, broadcast to other users that the user is typing
        socket.on('typing', function (data) {
            socket.broadcast.emit('typing', data);
        });
		
		
        //when an existing user disconnects, remove then from online db and notify others
        socket.on('disconnect', async function(){
			
            try {
                var data = socket.id;
                var sql = 'CALL remove_online(?)';
                var results = await pool.query(sql, data);
				
                if (results[0][0]) socket.broadcast.emit('activity', '<b>@' + results[0][0].user_name + '</b> has left the conversation');
				
            } catch (error) {
                console.log(error);
                //more error functions here
            } finally {
                //console.log('user @' + socket.id + ' has disconnected');
            }
			
			
			
        });
		
	
        //new public chat - store in DB
        socket.on('public chat', async function(msg){
			
            try {
                var data = [msg.author, msg.receiver, msg.body, 'public'];
                var sql = 'CALL add_discussion(?,?,?,?)';
                await pool.query(sql, data);
            } catch (error) {
                console.log(error);
                //more error functions here
            } finally {
                io.emit('public chat', msg);
                //console.log('public: ', msg);
            }
			
        });
	
	
        //new personal chat - store in DB
        socket.on('personal chat', async function(msg){
			
            try {
                var data = [msg.author, msg.receiver, msg.body, 'personal'];
                var sql = 'CALL add_discussion(?,?,?,?)';
                await pool.query(sql, data);
				
                var sql2 = 'get_socket_id_from_name(?)';
                var data2 = msg.receiver;
                //var socket_id = await pool.query(sql2, data2);
                //console.log("socket id = ", socket_id);
            } catch (error) {
                console.log(error);
                //more error functions here
            } finally {
                io.emit('personal chat', msg);
                //console.log('personal: ', msg);
            }
			
        });
	
	
        //new snap chat - do not store in DB
        socket.on('snap chat', function(msg){
            io.emit('snap chat', msg);
            //console.log('snap: ', msg);
        });
		
		
    });

    console.log('    > chat system is activated!');
	
};