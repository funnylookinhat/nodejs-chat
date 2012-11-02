$.fn.animateHighlight = (highlightColor, duration) ->
	highlightBg = highlightColor || "#FFFF9C"
	animateMs = duration || 1500
	originalBg = this.css "backgroundColor"
	this.stop().css("background-color", highlightBg).animate {backgroundColor: originalBg}, animateMs

username = ''

signup_form =
	$form: $ '#login-wrap > .initialize'

	init: ->
		signup_form._signIn()

	_signIn: ->
		signup_form.$form.submit (e) ->
			e.preventDefault()

			###
			DAVID DO YOUR SIGN IN MAGICZ HERE!!!1!1
			###

			###
			DAVID SET THE USERNAME HERE
			###
			username = $(this).find('#username').val()

			###
			DAVID PUT THIS IN YOUR CALLBACK:
			###
			$('#chat-wrap').fadeIn 'fast', ->
				$(this).find('.message-input').focus()
			$('#main .username-wrap').show()
			$('#main .username-placeholder').text username

chat =
	$compositionForm: $ '#chat-wrap > form.chat-entry'
	$chatWindow: $ '#chat-wrap > .chat-window'

	init: ->
		chat.sendMessage()
		chat._membersList()
	
	sendMessage: ->
		chat.$compositionForm.submit (e) ->
			e.preventDefault()

			###
			DAVID THE MESSAGE TO SEND IS STORED IN THE "message" VARIABLE. DUH!
			###
			message = $(this).find('.message-input').val() || $(this).find('.message-input').text()

			###
			clear the input box after sending a message
			###
			$(this).find('.message-input').text('').val('')

			###
			DAVID SEND ME BACK AN OBJECT WITH THESE VALUES FOR STARTERS
			###
			return_data =
				timestamp: 'hh:mm'
				username: username
				message: message
				###
				DAVID SET THIS TO THE MESSAGE THE SERVER SENT TO THE USER
				###

			###
			DAVID THIS IS THE CALLBACK FOR A SUCCESFULLY SENT MESSAGE
			###
			$new_message_element = $('<li class="sent"><span class="timestamp">' + return_data.timestamp +
							'</span> ' + return_data.message + ' <span class="username username-placeholder">' +
							return_data.username + '</span></li>')

			chat.$chatWindow.find('.messages').append $new_message_element
			chat.$chatWindow.animate(
				scrollTop: chat.$chatWindow.height(),
				"fast"
			)

			if return_data.message.toLowerCase().indexOf(username.toLowerCase()) > 0
				$new_message_element.addClass 'to-current-user'

	_membersList: ->
		$('#chat-members a').on 'click', (e) ->
			e.preventDefault()
			un = $(this).text()
			$chat_input = $ '#chat-wrap > form .message-input'
			if $chat_input.val() == '' then $chat_input.val ('@' + un + ' ')
			else $chat_input.val($chat_input.val() + ' @' + un + ' ')
			$chat_input.focus()

$ ->
	signup_form.init()
	chat.init()