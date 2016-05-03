var socket = io();

var people = {};

$(document).ready(function() {
  $('form#msg').submit(function(e) {
    e.preventDefault();
    socket.emit('send', $('#m').val());
    $('#m').val('');
  });

  $('form#name_change').submit(function(e) {
    e.preventDefault();
    socket.emit('join', $('#name').val());
    $('#name').val('');
  });

  socket.on('chat', function(who, msg) {
    var now = new Date();
    var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    $('#messages').append($('<li>').text('< ' + timestring + ' > ' + who + ': ' + msg));
  });

  socket.on('update', function(msg) {
    var now = new Date();
    var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    $('#messages').append($('<li>').text('< ' + timestring + ' > ' + msg));
  });

  socket.on('update-people', function(people) {
    $('#people').empty();
    $.each(people, function(clientid, name) {
      $('#people').append(name);
    });
  });

  socket.on('disconnect', function() {
    var now = new Date();
    var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    $('#messages').append($('<li>').text('< ' + timestring + ' > The server is not available.'));
  });
});


socket.on('connection', function(client) {
  client.on('join', function(name) {
    people[client.id] = name;
    client.emit('update', 'You have connected to the server.');
    socket.sockets.emit('update', name + ' has joined the server.');
    socket.sockets.emit('update-people', people);
  });

  client.on('send', function(msg) {
    socket.sockets.emit('chat', people[client.id], msg);
  });

  client.on('disconnect', function() {
    socket.sockets.emit('update', people[client.id] + ' has left.');
    delete people[client.id];
    socket.sockets.emit('update-people', people);
  });
});
