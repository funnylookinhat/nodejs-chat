// Includes
var sanitize = require('./includes/sanitize');

// Basic HTTP Delivery with Express
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Database w/ Redis
var redis = require('redis');
var db = redis.createClient();

// Pick a number... any number...  0-15.
db.select(13);

// We prefix all of our keys with this to avoid any collision.
var DB_PRE = "nodejs-chat-";
// And some key helpers.  No strings in our lines!
var DB_USERNAME_PRE = "username-";
var DB_MESSAGES = "messages";

// Do some quick database cleanup.
db.del(DB_PRE+DB_MESSAGES,function(error,value) {
	if( error ) {
		console.log("Error removing previous messages: "+error);
	}
});

// Socket.IO
var io = require('socket.io').listen(server);

// Start basic web server.
server.listen(1337);

// CSS
app.get('/css/*', function(req, res) {
	res.sendfile('./css/'+req.params[0]);
});

// JS
app.get('/js/*', function(req, res) {
	res.sendfile('./js/'+req.params[0]);
});

// index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


// Socket Listeners and Events
io.sockets.on('connection', function (socket) {
  
  // 'nick' Event
  // Change or set a nickname.
  socket.on('nick', function(data) {
  	var eventTime = String(Math.round(new Date().getTime() / 1000));
  	var oldUsername = null;
  	db.get(DB_PRE+DB_USERNAME_PRE+socket.id,function(error,value) {
  		if( value != null ) {
  			oldUsername = value;
  		}
  	});
  	db.set(DB_PRE+DB_USERNAME_PRE+socket.id,data.nick);
  	if( oldUsername == null ) {
  		// New user joined chat.
  		socket.emit('signon',{nick:data.nick});

      socket.broadcast.emit('event',{
  			text: data.nick+' has joined the room.',
  			type: 'neutral',
  			time: eventTime
  		});
  		// If you want to have a user get the last 10 messages or so...
  		// This would be the place to do it.
  	} else {
  		// User changed nick.
  		socket.broadcast.emit('event',{
  			text: oldUsername+' has changed their name to '+data.nick+'.',
  			type: 'neutral',
  			time: eventTime
  		});
  	}
  });

  // 'message' Event
  // Send a message.
  socket.on('message', function(data) {
    var eventTime = Math.round(new Date().getTime() / 1000);
  	if( data.text == undefined || 
  		! data.text.length ) {
  		socket.emit('event',{
  			text: 'That message did not include a text element.',
  			type: 'error',
  			time: eventTime
  		});
    	return;
  	}
  	// Validate user has set a username.
  	db.get(DB_PRE+DB_USERNAME_PRE+socket.id,function(error,value) {
  		var username = value;
  		if( username == null ) {
        socket.emit('event',{
  				text: 'You must set a nickname before you can send messages.',
  				type: 'error',
  				time: eventTime
  			});
  		} else {
  			var eventTime = String(Math.round(new Date().getTime() / 1000));
        // Add database caching here.
        socket.broadcast.emit('message',{
          nick: username,
          text: data.text,
          time: eventTime
        });
        socket.emit('message',{
          nick: username,
          text: data.text,
          time: eventTime
        });
  		}
  	});
  });

  socket.on('get', function(data) {
  	db.get(socket.id,function(err,value) {
  		if( err ) {
  			socket.emit('getResponse', {status:"ERROR: "+err.toString()});
  		} else {
  			socket.emit('getResponse', {status:value});
  		}
  	});
  });
  socket.on('set', function(data) {
  	db.set(socket.id,socket.id+':'+data.status);
  	socket.emit('getResponse', {status:socket.id+':'+data.status});
  });
});

/*
db.get('keythatdoesnotexists',function(error,value) {
	console.log("ERROR");
	console.log(error);
	console.log("VALUE");
	console.log(value);
	if( value == null ) {
		console.log("NULL!");
	} else {
		console.log("Not null?");
	}
});
*/