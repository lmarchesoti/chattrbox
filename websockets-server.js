var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});

class ChatRoom {
    constructor() {
        this.messages = [];
    }

    addMessage(message) {
        this.messages.push(message);
    }

    sendBacklog(socket) {
        this.messages.forEach(function (msg) {
            socket.send(msg);
        });
    }

    broadcast(data) {
        ws.clients.forEach(function (clientSocket) {
            clientSocket.send(data);
        });
    }
}

var chatRoom = new ChatRoom();

console.log('websockets server started');

function handleMessage() {
    return function (data) {
        console.log('message received: ' + data);
        chatRoom.addMessage(data);
        chatRoom.broadcast(data);
    };
}

ws.on('connection', function (socket) {
    console.log('client connection established');
    chatRoom.sendBacklog(socket);
    socket.on('message', handleMessage());
});
