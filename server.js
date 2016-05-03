var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http_server = require('http').Server(app);
var io = require('socket.io').listen(http_server);

var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http_server.listen(process.env.PORT || 3000);

io.on('connection', function(socket) {
  people[socket.id] = 'guest' + Math.ceil(Math.random() * 10);
  io.emit('update', people[socket.id] + ' has joined.');
  io.emit('update-people', people);

  socket.on('join', function(name) {
    people[socket.id] = name;
    io.emit('update', name + ' has joined.');
    io.emit('update-people', people);
  });

  socket.on('send', function(msg) {
    io.emit('chat', people[socket.id], msg);
  });

  socket.on('disconnect', function() {
    io.emit('update', people[socket.id] + ' has left.');
    delete people[socket.id];
    io.emit('update-people', people);
  });
});
