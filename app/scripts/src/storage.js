class Store {
    constructor(storageApi) {
        this.api = storageApi;
    }

    get() {
        return this.api.getItem(this.key);
    }

    set(value) {
        this.api.setItem(this.key, value);
    }
}

export class UserStore extends Store {
    constructor(key) {
        super(sessionStorage);
        this.key = key;
    }
}

export class MessageStore extends Store {
    constructor(key) {
        super(localStorage);
        this.key = key;
    }

    addMessage(msg) {
        let messages = this.get();
        messages.push(msg);
        this.set(messages);
    }

    getAll(fn) {
        let messages = this.get();
        return Array.from(messages, fn);
    }

    get() {
        let store = JSON.parse(this.api.getItem(this.key));
        if (store === null) {
            return [];
        } else {
            return store;
        }
    }

    set(value) {
        this.api.setItem(this.key, JSON.stringify(value));
    }
}
