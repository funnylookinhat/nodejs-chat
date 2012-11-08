// Define chat server listeners and emits.

var sanitize = require('./sanitize');
var packets = require('./packets');

var io;
var nicks = [];
var log = [];		// Array of Objects with .event and .packet

// Note
// pop() = remove last element
// unshift() = beginning push

exports = module.exports = function(params) {
  io = params.io;
  // Socket Listeners and Events
  io.sockets.on('connection', function (socket) {
    // Change or set a nickname.
    socket.on('nick', function(data) {
      var oldUsername = null;
      if( nicks[socket.id] != null ) {
        oldUsername = nicks[socket.id];
      }
      nicks[socket.id] = data.nick;
      
      // Send backlog.
      for( i = (log.length - 1); i >= 0; i-- ) {
        socket.emit(log[i].event,log[i].packet);
      }  

      // And notify of login.
      socket.emit('signon',packets.Signon({
      	nick: nicks[socket.id]
      }));  

      if( oldUsername == null ) {
        // New user joined chat.
        log.unshift({
          event: 'notification',
          packet: packets.Notification({
            nick: data.nick,
            type: 'neutral',
            text: ' has joined the room.'
          })
        });
      } else {
        // User changed nick.
        log.unshift({
          event: 'notification',
          packet: packets.Notification({
            nick: oldUsername,
            type: 'neutral',
            text: ' has changed their name to '+data.nick+'.'
          })
        });
      }  

      // Update.
      socket.broadcast.emit(log[0].event,log[0].packet);
      if( log.length > 10 ) {
        log.pop();
      }
    });
    
    // 'message' Event
    // Send a message.
    socket.on('message', function(data) {
      if( data.text == undefined || 
        ! data.text.length ) {
        socket.emit('error',packets.Error({
          event: 'message',
          text: 'That message did not include any text.'
        }));
        return;
      }  

      // Validate user has set a username.
      if( nicks[socket.id] == undefined ||
        nicks[socket.id] == null ) {
        socket.emit('error',packets.Error({
          event: 'message',
          text: 'You must set a nickname before you can send messages.'
        }));
      } else {  
        log.unshift({
          event: 'message',
          packet: packets.Message({
            nick: String(nicks[socket.id]),
            text: sanitize.strip_tags(data.text)
          })
        });
        socket.emit(log[0].event,log[0].packet);
        socket.broadcast.emit(log[0].event,log[0].packet);
        if( log.length > 10 ) {
          log.pop();
        }
      }
    });

    // User disconnects from chatroom.
    socket.on('disconnect', function () {
      if( nicks[socket.id] != null ) {
        var nick = String(nicks[socket.id]);
        nicks.splice(socket.id,1);

        log.unshift({
          event: 'notification',
          packet: packets.Notification({
            nick: nick,
            type: 'neutral',
            text: ' has left the room.'
          })
        });

        socket.broadcast.emit(log[0].event,log[0].packet);
        if( log.length > 10 ) {
          log.pop();
        }
      }
    });
  });
};

