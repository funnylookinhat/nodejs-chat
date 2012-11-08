(function() {
  var chat, signup_form;
  var myUsername;
  // Connect to socket.
  var socket = io.connect('http://localhost');

  socket.on('signon', function(data) {
    myUsername = data.nick;
    $('#login-wrap').slideUp();
    $('#chat-wrap').fadeIn('fast', function() {
      return $(this).find('.message-input').focus();
    });
    $('#main .username-wrap').show();
    return $('#main .username-placeholder').text(myUsername);
  });

  socket.on('message', function(data) {
    var date = new Date(data.time*1000);
    var timestamp = date.getHours()+':';
    if( date.getMinutes() < 10 ) {
      timestamp += '0';
    }
    timestamp += date.getMinutes();
    var classMessage = "received";
    if( data.nick == myUsername ) {
      classMessage = "sent";
    }
    chat.$chatWindow.find('.messages').append('<li class="'+classMessage+'"><span class="timestamp">' + timestamp + '</span> ' + data.text + ' <span class="username username-placeholder">' + data.nick + '</span></li>');
    return chat.$chatWindow.animate({
      scrollTop: chat.$chatWindow.height()
    }, "fast");
  });

  socket.on('notification', function(data) {
    var date = new Date(data.time*1000);
    var timestamp = date.getHours()+':';
    if( date.getMinutes() < 10 ) {
      timestamp += '0';
    }
    timestamp += date.getMinutes();
    var classMessage = "received";
    if( data.nick == myUsername ) {
      classMessage = "sent";
    }
    chat.$chatWindow.find('.messages').append('<li class="event '+data.type+'"><span class="timestamp">' + timestamp + '</span> '+'<a href="#">' + data.nick + '</a>' + data.text + '</li>');
    return chat.$chatWindow.animate({
      scrollTop: chat.$chatWindow.height()
    }, "fast");
  });

  /*
  EVENT:
 
                <span class='timestamp'>hh:mm</span>
                <a href="#">David</a>
                joined the chat room
              </li>
   */

  signup_form = {
    $form: $('#login-wrap > .initialize'),
    init: function() {
      return signup_form._signIn();
    },
    _signIn: function() {
      return signup_form.$form.submit(function(e) {
        e.preventDefault();
        var username = $(this).find('#username').val();
        socket.emit('nick',{nick: username});
      });
    }
  };

  chat = {
    $compositionForm: $('#chat-wrap > form.chat-entry'),
    $chatWindow: $('#chat-wrap > .chat-window'),
    init: function() {
      return chat._sendMessage();
    },
    _sendMessage: function() {
      return chat.$compositionForm.submit(function(e) {
        e.preventDefault();
        var message, return_data;
        
        message = $(this).find('.message-input').val() || $(this).find('.message-input').text();
        socket.emit('message',{text:message});
        $(this).find('.message-input').text('').val('');
      });
    }
  };

  $(function() {
    signup_form.init();
    return chat.init();
  });

}).call(this);
