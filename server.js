var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var child_process = require('child_process');
var pingHost = child_process.fork('./ping.js');
var errMachine = child_process.fork('./errorMachine_monitor.js');

console.log("alive server start.");

pingHost.on('message', function(msg) {
  io.emit('aliveMsg', JSON.stringify(msg));
  /*
  for (var x = 0; x < msg.length; x++) {
    console.log("aliveMsg " + x + ":");
    console.log(msg[x]);
  }
  */
});

errMachine.on('message', function(msg) {
  io.emit('errMachineMsg', JSON.stringify(msg));
  /*
  console.log("errorMachineMsg: ");
  console.log(msg);
  */
});

app.use(express.static(__dirname + '/javascript'));
app.use(express.static(__dirname + '/json'));

app.get('/', function(req, res) {
  //res.type('html');
  res.charset = 'utf-8';
  //res.contentType('text/html');
  //res.header('Content-Type', 'text/html; charset=utf-8')
  res.sendfile('status.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  pingHost.send('firstInit');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(8888, function() {
  console.log('listening on 8888');
});
