import socket from './ws-client';
import {MessageStore, UserStore} from "./storage";
import {ChatForm, ChatList, promptForUsername} from "./dom";

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
    username = promptForUsername();
    userStore.set(username);
}

let messageStore = new MessageStore('x-chattrbox/m');

class ChatApp {
    constructor() {
        this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
        this.chatList = new ChatList(LIST_SELECTOR, username);

        messageStore.getAll(msg => new ChatMessage(msg)).forEach((message) => {
            this.chatList.drawMessage(message.serialize());
        });

        socket.init('ws://localhost:3001');
        socket.registerOpenHandler(() => {
            this.chatForm.init((data) => {
                let message = new ChatMessage({message: data});
                socket.sendMessage(message.serialize());
            });
            this.chatList.init();
        });
        socket.registerMessageHandler((data) => {
            console.log(data);
            let message = new ChatMessage(data);
            messageStore.addMessage(message);
            this.chatList.drawMessage(message.serialize());
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

export default ChatApp;
