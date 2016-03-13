var express = require('express'),
    fs = require('fs'),
    http = require('http');
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    index = fs.readFileSync(__dirname + '/index.html'),
    PORT = 80;

var Song = require('./song');

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
      socket.join(code);
    });
    socket.on('command', function(data){
      io.in(socket.room).emit('command', data);
      console.log("Command");
    });
    socket.on('end', function(data){
      io.in(socket.room).emit('end', data);
      console.log("End");
    });
    socket.on('addSong', function(data){
      console.log("KEYS: " + Object.keys)
      var title = data["title"];
      var author = data["author"];
      var content = JSON.stringify(data["content"]);
      console.log("Request with title = " + title + ", author = " + author + "content =" + content);
    })
});

console.log('Express server started on port %s', PORT);
server.listen(PORT);
