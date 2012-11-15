// Define chat server listeners and emits.

var sanitize = require('./sanitize');
var packets = require('./packets');

var io;
var nicks = [];
var messagetimes = [];
var messagecount = [];
var log = [];		// Array of Objects with .event and .packet

var MESSAGE_COUNT_LIMIT = 5; // 5 Messages
var MESSAGE_TIME_LIMIT = 8;  // Per 8 Seconds
var MESSAGE_RATE_LIMIT = Math.round(MESSAGE_COUNT_LIMIT / MESSAGE_TIME_LIMIT * 100) / 100;  // 5 Messages per 8 Seconds

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
        // Make sure user hasn't sent too many messages.
        // Essentially we rate limit - or have them wait a max of MESSAGE_TIME_LIMIT seconds
        if( messagetimes[socket.id] == null || 
            messagecount[socket.id] == null || 
            messagecount[socket.id] <= MESSAGE_COUNT_LIMIT || 
            ( messagecount[socket.id] / ( Math.round(Date.now() / 1000) - messagetimes[socket.id] ) ) < MESSAGE_RATE_LIMIT || 
            Math.round(Date.now() / 1000) - messagetimes[socket.id] > MESSAGE_TIME_LIMIT ) {
          if( messagetimes[socket.id] == null ||
              messagecount[socket.id] > MESSAGE_COUNT_LIMIT ) {
            messagetimes[socket.id] = Math.round(Date.now() / 1000);
          }
          if( messagecount[socket.id] == null ||
              messagecount[socket.id] > MESSAGE_COUNT_LIMIT ) {
            messagecount[socket.id] = 0;
          }
          messagecount[socket.id] += 1;

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
        } else {
          messagecount[socket.id] += 1;
          // Error too frequent.
          var errorText = 'You are attempting to send too many messages at once... '+
                          'please wait before sending another message.';
          if( ( messagecount[socket.id] / ( Math.round(Date.now() / 1000) - messagetimes[socket.id] ) ) > ( MESSAGE_RATE_LIMIT * 4 ) ) {
            errorText = 'Seriously - the more you type the longer you wait...';
          };
          socket.emit('error',packets.Error({
            event: 'message',
            text: errorText
          }));
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

