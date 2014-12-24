var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var child_process = require('child_process');
// var n = child_process.fork('./ping.js');

console.log("alive server start.");

app.use(express.static(__dirname + '/javascript'));

app.get('/', function(req, res) {
  res.charset = 'utf-8';
  res.sendfile('status.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  n.send('firstInit');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(8888, function() {
  console.log('listening on 8888');
});
