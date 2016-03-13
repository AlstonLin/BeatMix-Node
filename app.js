var express = require('express'),
    fs = require('fs'),
    http = require('http');
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    index = fs.readFileSync(__dirname + '/index.html'),
    PORT = 80;

var Session = require('./session');

// Hello World at root to check if works
app.get('/', function(req, res){
  console.log("Requested");
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});

// Socket io
io.on('connection', function(socket) {
    console.log("Connection");
    // Join a room
    socket.on('join', function(data){
      var code = data.code;
      console.log("Joined room " + code );
      socket.join(code);
    })
    socket.on('command', function(data){
      var roomName = Object.keys(socket.rooms)[1];
      io.in(roomName).emit('command', data);
      console.log("Command " + data.note + " at " + roomName);
    });
    socket.on('end', function(data, id){
      io.in(id).emit('end', data);
      console.log("End");
    });
});

console.log('Express server started on port %s', PORT);
server.listen(PORT);
