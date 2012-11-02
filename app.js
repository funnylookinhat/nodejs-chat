/**
 * Emit Types and Data Schemes
 *
 * --- These are sent FROM the SERVER to the CLIENT ---
 * 
 * signon: Sent when you've successfully set a username and can post messages.
 *   .nick : The nickname you've set.
 *
 * event: An event has happened in the chatroom ( generally emoted by a person )
 *   .nick : The user who the event pertains to
 *   .text : The text of the event.
 *   .type : The type ( i.e. error, neutral, success )
 *   .time : The GMT unix timestamp.
 *
 * message: A message has been sent.
 *   .nick : The user who sent the message.
 *   .text : The message text.
 *   .time : The GMT unix timestamp.
 *
 * error: An error occurred
 *   .text : The error message
 *
 *
 * --- These are sent FROM the CLIENT to the SERVER ---
 *
 * message: Send a message
 *   .text : The text of the message
 *
 * nick: Set or update the user's nickname
 *   .nick : The new username for the user.
 *   * NOTE *  When setting a new nickname, you should not 
 *             update the client until the "signon" event is emited
 *             with the new nickname.
 * 
 */


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
      socket.emit('signon',{
        nick:data.nick
      });

      socket.broadcast.emit('event',{
        nick: data.nick,
        text: ' has joined the room.',
        type: 'neutral',
        time: eventTime
      });
      // If you want to have a user get the last 10 messages or so...
      // This would be the place to do it.
    } else {
      // User changed nick.
      socket.emit('signon',{
        nick:data.nick
      });
      
      socket.broadcast.emit('event',{
        nick: oldUsername,
        text: ' has changed their name to '+data.nick+'.',
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
  		socket.emit('error',{
  			text: 'That message did not include a text element.'
  		});
    	return;
  	}
  	
    // Validate user has set a username.
    if( nicks[socket.id] == undefined ||
        nicks[socket.id] == null ) {
      socket.emit('error',{
  		  text: 'You must set a nickname before you can send messages.'
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
