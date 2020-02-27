import socket from './ws-client';
import {UserStore} from "./storage";
import {ChatForm, ChatList, promptForRoom, promptForUsername} from "./dom";

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
    username = promptForUsername();
    userStore.set(username);
}

let room = promptForRoom();

class ChatApp {
    constructor() {
        this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
        this.chatList = new ChatList(LIST_SELECTOR, username);

        socket.init('ws://localhost:3001');
        socket.registerOpenHandler(() => {
            this.chatForm.init((data) => {
                let message = new ChatMessage({message: data});
                let payload = new Payload({command: 'message', data: message});
                socket.sendMessage(payload.serialize());
            });
            this.chatList.init();
            socket.sendMessage((new Payload({command: 'enter-room', data: room})).serialize());
            socket.sendMessage((new Payload({command: 'get-rooms'})));
        });
        socket.registerMessageHandler((data) => {
            console.log(data);
            let payload = new Payload(data);
            switch (payload.command) {
                case 'message':
                    let message = new ChatMessage(JSON.parse(payload.data));
                    this.chatList.drawMessage(message.serialize());
                    break;
                case 'rooms':
                    console.log(payload.data);
                    break;
                default:
                    break;
            }
        });
    }
}

class ChatMessage {
    constructor({
                    message: m,
                    user: u = username,
                    timestamp: t = (new Date()).getTime()
                }) {
        this.message = m;
        this.user = u;
        this.timestamp = t;
    }

    serialize() {
        return {
            user: this.user,
            message: this.message,
            timestamp: this.timestamp
        };
    }
}

class Payload {
    constructor({
                    user: u = username,
                    command: c,
                    data: d
                }) {
        this.user = u;
        this.command = c;
        this.data = d;
    }

    serialize() {
        return {
            user: this.user,
            command: this.command,
            data: this.data
        }
    }
}

export default ChatApp;
