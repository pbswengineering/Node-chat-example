var fs = require('fs'),
    http = require('http'),
    io = require('socket.io'),
    url = require('url');

function sendStaticFile(response, filename, replaces) {
  fs.readFile('static/' + filename, encoding='utf8', function(err, data) {
    response.writeHeader(200, {'Content-Type': 'text/html'});
    if (replaces != undefined) {
      for (var key in replaces) {
        data = data.replace(new RegExp(key, 'g'), replaces[key]);
      }
    }
    response.end(data);
  });
}
    
var server = http.createServer(function(request, response) {
  var urlObj = url.parse(request.url, true),
      path = urlObj.pathname;
      
  if (path === '/') {
    sendStaticFile(response, 'join.html');
  } else if (path === '/chat') {
    var nickname = urlObj.query['nickname'];
    if (nickname !== undefined) {
      sendStaticFile(response, 'chat.html', {'#NICKNAME#': nickname});
    } else {
      sendStaticFile(response, 'join.html');
    }    
  } else {
    response.writeHeader(404, {"Content-Type": "text/plain"});
    response.end('404 Not Found\n');
  }
});
server.listen(8000, 'localhost');
console.log('Chat started.');

var socket = io.listen(server);
socket.on('connection', function(client) { 
  client.on('message', function(msg) {
    socket.broadcast(msg);
  });
});
