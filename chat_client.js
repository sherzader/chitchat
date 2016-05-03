var socket = io.connect(window.location.hostname);

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
});

socket.on('chat', function(who, msg) {
  var now = new Date();
  var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  $('#messages').append('<li>< ' + timestring + ' > <strong>' + who + '</strong> : ' + msg + '</li>');
});

socket.on('update', function(msg) {
  var now = new Date();
  var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  $('#messages').append($('<li>').text('< ' + timestring + ' > ' + msg));
});

socket.on('update-people', function(people) {
  $('#people').empty();
  $.each(people, function(clientid, name) {
    $('#people').append(name + '<br />');
  });
});

socket.on('disconnect', function() {
  var now = new Date();
  var timestring = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  $('#messages').append($('<li>').text('< ' + timestring + ' > The server is not available.'));
});
