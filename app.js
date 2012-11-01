// Includes
var sanitize = require('./includes/sanitize');

// Basic HTTP Delivery with Express
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var nicks = [];

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
  	if( nicks[socket.id] != undefined &&
        nicks[socket.id] != null ) {
  		oldUsername = value;
  	}
  	nicks[socket.id] = data.nick;
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
    if( nicks[socket.id] == undefined ||
        nicks[socket.id] == null ) {
      socket.emit('event',{
  		  text: 'You must set a nickname before you can send messages.',
  		  type: 'error',
  		  time: eventTime
  		});
  	} else {
  		var eventTime = String(Math.round(new Date().getTime() / 1000));
      // Add database caching here.
      socket.broadcast.emit('message',{
        nick: nicks[socket.id],
        text: data.text,
        time: eventTime
      });
      socket.emit('message',{
        nick: nicks[socket.id],
        text: data.text,
        time: eventTime
      });
  	}
  });
});
