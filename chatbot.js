var WebSocket = require('ws');
var NAME = 'robert';

var chatClient = new WebSocket('http://localhost:3001');

chatClient.on('message', function (data) {
    console.log(data);
    if (data.toLowerCase().includes(NAME)) {
        chatClient.send('Huh, you talkin to me, sir?');
    }
});
