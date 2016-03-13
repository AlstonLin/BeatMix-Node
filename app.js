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
    socket.on('join', function(data) {
      var code = data.code;
      console.log("Joined room " + code );
      socket.join(code);
    });
    socket.on('command', function(data) {
      var roomName = Object.keys(socket.rooms)[1];
      io.in(roomName).emit('command', data);
      console.log("Command " + data.note + " at " + roomName);
    });
    socket.on('end', function(data) {
      var roomName = Object.keys(socket.rooms)[1];
      io.in(roomName).emit('end', data);
      console.log("End at " + roomName);
    });
    socket.on('addSong', function(data) {
      var title = data["title"];
      var author = data["author"];
      var content = JSON.stringify(data["content"]);
      console.log("Request with title = " + title + ", author = " + author + "content =" + content);
      var newSong = new Song({
        title: title,
        author: author,
        content: content
      });
      newSong.save(function(err) {
        if (err){
          console.log("ERROR SAVING SONG: " + err);
        } else{
          console.log("Saved song!");
        }
      });
    })
    socket.on('getSongs', function() {
      var person = Object.keys(socket.rooms)[0];
      var results = Song.find({}, { content: 0 }).sort( [['_id', -1]] ).limit(10);
      console.log("Queried Songs: " + results);
      io.in(person).emit('songs', results);
    });
    socket.on('getSong', function(data) {
      var songId = data["songId"];
      var result = Song.find(songId, { content: 1 });
      console.log("Served Song id: " + songId);
      io.in(person).emit('song', result);
    });
    socket.on('disconnect', function(){
      var rooms = io.sockets.manager.roomClients[socket.id];
      for(var room in rooms) {
          socket.leave(room);
      }
    });
});

console.log('Express server started on port %s', PORT);
server.listen(PORT);
