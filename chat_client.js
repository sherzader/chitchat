var socket = io();

$(document).ready(function() {
  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  });

  $('#name').submit(function(e) {
    socket.emit('new user', $('#name').val());
    $('#name').val('');
  });
});

socket.on('chat message', function(msg) {
  var now = new Date();
  var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  $('#messages').append($('<li>').text('< ' + timestring + ' > ' + msg));
});
