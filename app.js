// Basic HTTP Delivery with Express
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Database w/ Redis
var redis = require('redis');
var db = redis.createClient();

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