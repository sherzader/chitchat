var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.sockets.on('connection', function(socket) {
  socket.on('join', function(name) {
    people[socket.id] = name;
    socket.emit('update', 'You have connected to the server.');
    socket.emit('update', name + ' has joined the server.');
    socket.emit('update-people', people);
  });

  socket.on('send', function(msg) {
    socket.emit('chat', people[socket.id], msg);
  });

  socket.on('disconnect', function() {
    socket.emit('update', people[socket.id] + ' has left.');
    delete people[socket.id];
    socket.emit('update-people', people);
  });
});
