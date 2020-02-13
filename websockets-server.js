var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var messages = [];
var users = [];
var PASSWORD = 'swordfish';

console.log('websockets server started');

function User(socket) {
    this.__authenticated = false;
    this.__socket = socket;


    User.prototype.authenticated = function () {
        return this.__authenticated;
    };

    User.prototype.authenticate = function () {
        this.__authenticated = true;
    };

    User.prototype.processMessage = function (data) {
        console.log('message received: ' + data);
        console.log(this.authenticated());
        if (this.authenticated()) {
            messages.push(data);
            users.forEach(function (user) {
                if (user.authenticated()) {
                    user.sendMessage(data);
                }
            });
        } else {
            if (PASSWORD === data.toLowerCase()) {
                this.authenticate();

                messages.forEach(function (msg) {
                    this.__socket.send(msg);
                }.bind(this));
            }
        }
    };

    User.prototype.sendMessage = function (data) {
        this.__socket.send(data);
    };

    this.__socket.on('message', this.processMessage.bind(this));

    this.__socket.on('close', function (data) {
        console.log('user disconnected');
    });
}

ws.on('connection', function (socket) {
    console.log('client connection established');
    console.log(ws.clients.size + ' users connected.');

    users.push(new User(socket));
});

