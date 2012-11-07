
// Basic HTTP Delivery with Express
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Socket.IO
var io = require('socket.io').listen(server);

// Start server.
server.listen(process.env.PORT || 1337);

// Static pages & CSS/JS
var static = require('./libs/static')({
  app: app,
  baseDirectory: __dirname
});

var chat = require('./libs/chat')({
  io: io
});

