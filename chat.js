var socket = io();

$(document).ready(function() {
  $('form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  });
});
socket.on('chat message', function(msg) {
  console.log(msg);
  var now = new Date();
  var timestring = now.getHours() + ':' + now.getMinutes();
  $('#messages').append($('<li>').text('< ' + timestring + ' > ' + msg));
});
