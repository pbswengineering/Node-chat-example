var fs = require('fs'),
    http = require('http'),
    io = require('socket.io'),
    url = require('url');

function sendStaticFile(res, filename, replaces) {
    fs.readFile('static/' + filename, encoding='utf8', function(err, data) {
        res.writeHeader(200, {'Content-Type': 'text/html'});
        console.log(typeof file);
        if (replaces != undefined) {
            for (var key in replaces) {
                data = data.replace(new RegExp(key, 'g'), replaces[key]);
            }
        }
        res.end(data);
    });
}
    
var server = http.createServer(function(req, res) {
    console.log("Hello");
    console.log("req " + req);
    var urlObj = url.parse(req.url, true),
        path = urlObj.pathname;
        
    if (path == '/') {
        sendStaticFile(res, 'login.html');
    } else if (path == '/chat') {
        var nickname = urlObj.query['nickname'];
        if (nickname != undefined) {
            sendStaticFile(res, 'chat.html', {'#NICKNAME#': nickname});
        } else {
            sendStaticFile(res, 'login.html');
        }    
    } else {
        res.writeHeader(404, {"Content-Type": "text/plain"});
        res.end('404 Not Found\n');
    }
});
server.listen(8888, 'localhost');
console.log('Chat started');

var socket = io.listen(server);
socket.on('connection', function(client) { 
    client.on('message', function(msg) {
        socket.broadcast(msg);
    });
});
