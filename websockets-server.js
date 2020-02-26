var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});

class ChatRoom {
    constructor() {
        this.messages = [];
        this.clients = [];
    }

    addMessage(message) {
        this.messages.push(message);
        this.broadcast(message);
    }

    addClient(socket) {
        this.clients.push(socket);
        this.sendBacklog(socket);
    }

    sendBacklog(socket) {
        this.messages.forEach(function (msg) {
            socket.send(msg);
        });
    }

    broadcast(data) {
        this.clients.forEach(function (clientSocket) {
            clientSocket.send(data);
        });
    }
}

var chatRooms = {};
var userRooms = {};

console.log('websockets server started');

function handleMessage(payload) {
    let room = userRooms[payload.user] || 'Lobby';
    chatRooms[room].addMessage(JSON.stringify(payload.data));
}

function handleEnterRoom(payload) {
    let room = payload.data;
    if (!Object.keys(chatRooms).includes(room)) {
        chatRooms[room] = new ChatRoom();
    }
    chatRooms[room].addClient(this);
    userRooms[payload.user] = room;
}

function handlePayload() {
    return function (data) {
        console.log('message received: ' + data);
        let payload = JSON.parse(data);

        switch (payload.command) {
            case "message":
                handleMessage(payload);
                break;
            case "enter-room":
                handleEnterRoom.call(this, payload);
                break;
            default:
                break;
        }
    };
}

ws.on('connection', function (socket) {
    console.log('client connection established');
    socket.on('message', handlePayload());
});
