var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var mime = require('mime/lite');

var handleError = function (err, res) {
    res.writeHead(404);
    res.end();
};

var server = http.createServer(function (req, res) {
    console.log('Responding to a request.');

    var filePath = extract(req.url);
    let fileExtension = filePath.split('.').pop();
    var mimeType = mime.getType(fileExtension);
    console.log('Mime type is: ' + mimeType);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            handleError(err, res);
            return;
        } else {
            res.setHeader('Content-Type', mimeType);
            res.end(data);
        }
    });
});
server.listen(3000);