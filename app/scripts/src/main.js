import ChatApp from "./app";
import socket from './ws-client';

function connect() {
    new ChatApp();
    socket.registerCloseHandler(reconnect());
}

function reconnect() {
    return () => {
        if (confirm('Connection closed. Reconnect?')) {
            connect();
        }
    };
}

connect();
