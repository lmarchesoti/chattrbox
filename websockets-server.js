var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var messages = [];
var observers = {'connection': []};

function observe(event, observer) {
    observers[event].push(observer);
}

function sendEvent(event) {
    observers[event].forEach(function (observer) {
        observer.processEvent(event);
    });
}

console.log('websockets server started');

ws.on('connection', function (socket) {
    console.log('client connection established');

    messages.forEach(function (msg) {
        socket.send(msg);
    });

    sendEvent('connection');

    socket.on('message', function (data) {
        console.log('message received: ' + data);
        messages.push(data);
        ws.clients.forEach(function (clientSocket) {
            clientSocket.send(data);
        });
    });
});

module.exports = { observe: observe };
