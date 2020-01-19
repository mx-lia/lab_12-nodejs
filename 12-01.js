const http = require('http');
const websocket = require('ws');
const fs = require('fs');

const get_handler = require('./get_handler_module');
const post_handler = require('./post_handler_module');
const put_handler = require('./put_handler_module');
const delete_handler = require('./delete_handler_module');

let server = http.createServer((request, response) => {
    switch(request.method){
        case 'GET': get_handler(request, response); break;
        case 'POST': post_handler(request, response); break;
        case 'PUT': put_handler(request, response); break;
        case 'DELETE': delete_handler(request, response); break;
    }
}).listen(4000);

let wss = new websocket.Server({port: 5000, host: 'localhost', path: '/broadcast'});

fs.watch('./static_files/StudentList.json', {encoding: 'buffer'}, (eventType, filename) => {
    if(eventType === 'change') {
        wss.clients.forEach((client) => {
            if (client.readyState === websocket.OPEN) {
                client.send(`File ${filename} is changed`);
            }
        });
    }
});