(function() {
  var chat, signup_form;

  signup_form = {
    $form: $('#login-wrap > .initialize'),
    init: function() {
      return signup_form._signIn();
    },
    _signIn: function() {
      return signup_form.$form.submit(function(e) {
        var username;
        e.preventDefault();
        username = $(this).find('#username').val();
        $('#chat-wrap').fadeIn('fast', function() {
          return $(this).find('.message-input').focus();
        });
        $('#main .username-wrap').show();
        return $('#main .username-placeholder').text(username);
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
        var message, return_data;
        e.preventDefault();
        message = $(this).find('.message-input').val() || $(this).find('.message-input').text();
        $(this).find('.message-input').text('').val('');
        return_data = {
          timestamp: 'hh:mm',
          username: 'Username',
          message: message
        };
        chat.$chatWindow.find('.messages').append('<li class="sent"><span class="timestamp">' + return_data.timestamp + '</span> ' + return_data.message + ' <span class="username username-placeholder">' + return_data.username + '</span></li>');
        return chat.$chatWindow.animate({
          scrollTop: chat.$chatWindow.height()
        }, "fast");
      });
    }
  };

  $(function() {
    signup_form.init();
    return chat.init();
  });

}).call(this);
