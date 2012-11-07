// Define the different Socket.IO Event Packets

/* Signon
 * Socket.IO Event: emit "signon"
 * Object Properties:
 * 		.nick		: The nickname as recognized by the server
 */
exports.Signon = (function (params) {
  var constructor = function (params) {
    this.nick = params.nick != undefined ? params.nick : null;
  }
  
  return constructor();
});

/* Message
 * Socket.IO Event: emit "message"
 * Object Properties:
 * 		.message	: Text of the message
 * 		.nick		: Nickname attached to the message
 * 		.time		: Unix timestamp for message (GMT)
 */
exports.Message = (function (params) {
  var constructor = function (params) {
    this.message = params.message != undefined ? params.message : null;
    this.nick = params.nick != undefined ? params.nick : null;
    this.time = params.time != undefined ? params.time : null;
  }
  
  return constructor();
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
  var constructor = function (params) {
    this.nick = params.nick != undefined ? params.nick : null;
    this.type = params.type != undefined ? params.type : null;
    this.text = params.text != undefined ? params.text : null;
    this.time = params.time != undefined ? params.time : null;
  }
  
  return constructor();
});

/* Error
 * Socket.IO Event: emit "signon"
 * Object Properties:
 *    .text   : The nickname as recognized by the server
 *    .event  : The emitted event that the error is in response to.
 */
exports.Error = (function (params) {
  var constructor = function (params) {
    this.text = params.nick != undefined ? params.nick : null;
    this.event = params.event != undefined ? params.event : null;
  }
  
  return constructor();
});