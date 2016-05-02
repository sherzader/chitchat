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
  $('#messages').append($('<li>').text(msg));
});
