var WebSocket = require('ws');

var WELCOME_MESSAGE = 'Hello everyone, my name is Robert!';

function Bot(name) {

    this.chatClient = null;
    this.name = name;

    Bot.prototype.connect = function (url) {
        this.chatClient = new WebSocket(url);

        this.chatClient.on('open', function () {
            this.chatClient.send(WELCOME_MESSAGE);
        }.bind(this));

        this.chatClient.on('message', function (data) {
            console.log(data);
            var lowerCaseMessage = data.toLowerCase();
            if (lowerCaseMessage.includes(this.name) && lowerCaseMessage !== WELCOME_MESSAGE.toLowerCase()) {
                this.chatClient.send('Huh, you talkin to me, sir?');
            }
        }.bind(this));
    };

    Bot.prototype.processEvent = function (event) {
        if (this.chatClient.readyState === 1 && event === 'connection') {
            this.chatClient.send('Welcome to our channel!');
        }
    };
}

module.exports = Bot;
