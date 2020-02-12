var http = require('http');
var route = require('./route')('app');

var server = http.createServer(function (req, res) {
    console.log('Responding to a request.');

    route.serve(req.url, function (err) {
        res.writeHead(404);
        res.end();
    }, function (data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
});
server.listen(3000);
