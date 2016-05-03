var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket) {
  socket.on('join', function(name) {
    people[socket.id] = name;
    io.emit('update', 'You have connected to the server.');
    io.emit('update', name + ' has joined the server.');
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
