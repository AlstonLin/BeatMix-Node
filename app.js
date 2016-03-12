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
    // Sends the data to everyone else
    socket.on('command', function(data){
        io.emit('command', data);
        console.log("Command");
    });
    socket.on('end', function(data){
        io.emit('end', data);
        console.log("End");
    });
});

console.log('Express server started on port %s', PORT);
server.listen(PORT);
