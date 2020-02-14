var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');
var Bot = require('./chatbot');
var NAME = 'robert';

var handleError = function (err, res) {
    res.writeHead(404);
    res.end();
};

var server = http.createServer(function (req, res) {
    console.log('Responding to a request.');

    var filePath = extract(req.url);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            handleError(err, res);
            return;
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        }
    });
});
server.listen(3000);

var bot = new Bot(NAME);
bot.connect('http://localhost:3001');
wss.observe('connection', bot);
