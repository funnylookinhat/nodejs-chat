// Define the different Socket.IO Event Packets

/* Signon
 * Socket.IO Event: emit "signon"
 * Object Properties:
 * 		.nick		: The nickname as recognized by the server
 */
exports.Signon = (function (params) {
  var packet = {};

  packet.nick = params.nick != undefined ? params.nick : null;

  return packet;
});

/* Message
 * Socket.IO Event: emit "message"
 * Object Properties:
 * 		.message	: Text of the message
 * 		.nick		: Nickname attached to the message
 * 		.time		: Unix timestamp for message (GMT)
 */
exports.Message = (function (params) {
  var packet = {};

  packet.text = params.text != undefined ? params.text : null;
  packet.nick = params.nick != undefined ? params.nick : null;
  packet.time = params.time != undefined ? params.time : String(Math.round(Date.now() / 1000));

  return packet;
});

/* Notification
 * Socket.IO Event: emit "notification"
 * Object Properties:
 * 		.nick		: Nickname attached to the message
 * 		.type 	: The type ( i.e. error, neutral, success )
 * 		.text 	: The text of the event.
 * 		.time		: Unix timestamp for message (GMT)
 */
exports.Notification = (function (params) {
  var packet = {};
  
  packet.nick = params.nick != undefined ? params.nick : null;
  packet.type = params.type != undefined ? params.type : null;
  packet.text = params.text != undefined ? params.text : null;
  packet.time = params.time != undefined ? params.time : String(Math.round(Date.now() / 1000));
  
  return packet;
});

/* Error
 * Socket.IO Event: emit "signon"
 * Object Properties:
 *    .text   : The nickname as recognized by the server
 *    .event  : The emitted event that the error is in response to.
 */
exports.Error = (function (params) {
  var packet = {};

  packet.text = params.nick != undefined ? params.nick : null;
  packet.event = params.event != undefined ? params.event : null;
  
  return packet;
});