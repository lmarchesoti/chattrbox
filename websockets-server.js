var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});

class Payload {
    constructor({username: u = 'system',
                    command: c,
                    data: d}) {
        this.username = u;
        this.command = c;
        this.data = d;
    }

    serialize() {
        return {
            username: this.username,
            command: this.command,
            data: this.data
        }
    }
}

class ChatRoom {
    constructor() {
        this.messages = [];
        this.clients = {};
    }

    addMessage(message) {
        this.messages.push(message);
        this.broadcast(message);
    }

    addClient(username, socket) {
        this.clients[username] = socket;
        this.sendBacklog(socket);
    }

    removeClient(username) {
        delete this.clients[username];
    }

    sendBacklog(socket) {
        this.messages.forEach(function (msg) {
            socket.send(JSON.stringify(new Payload({command: 'message', data: msg})));
        });
    }

    broadcast(data) {
        Object.values(this.clients).forEach(function (clientSocket) {
            clientSocket.send(JSON.stringify(new Payload({command: 'message', data: data})));
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

function exitOldRoom(payload) {
    let username = payload.user;
    if (userRooms.hasOwnProperty(username)) {
        chatRooms[userRooms[(username)]].removeClient(username);
    }
}

function enterNewRoom(payload) {
    let room = payload.data;
    let username = payload.user;
    chatRooms[room].addClient(username, this);
    userRooms[username] = room;
}

function validateOpenRoom(payload) {
    let room = payload.data;
    if (!Object.keys(chatRooms).includes(room)) {
        chatRooms[room] = new ChatRoom();
    }
}

function handleEnterRoom(payload) {
    validateOpenRoom(payload);
    exitOldRoom(payload);
    enterNewRoom.call(this, payload);
}

function handleGetRooms(socket) {
    socket.send(JSON.stringify(new Payload({command: 'rooms', data: Object.keys(chatRooms)})));
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
            case "get-rooms":
                handleGetRooms(this);
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
