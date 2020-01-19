const websocket = require('ws');

let ws = new websocket('ws://localhost:5000/broadcast');

ws.on('message', (message) => {
    console.log('Received message -> ', message);
});