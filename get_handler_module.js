const fs = require('fs');
const url = require('url');
const err_handler = require('./error_handler');

const file_path = './static_files/StudentList.json';

module.exports = (request, response) => {
    let path = url.parse(request.url).pathname;
    switch(true) {
        case path === '/': {
            fs.readFile(file_path, (err, data) => {
                response.setHeader('Content-Type', 'application/json');
                response.end(data);
            });
            break;
        }
        case /\/\d+/.test(path): {
            fs.readFile(file_path, (err, data) => {
                let json = JSON.parse(data.toString());
                let id = Number(path.match(/\d+/)[0]);
                for (let i = 0; i < json.length; i++) {
                    if(json[i].id === id) {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                    }
                }
                if(!response.hasHeader('Content-Type')) {
                    err_handler(request, response, 1, `Student with id = ${id} doesn't exist`);
                }
                response.end();
            });
            break;
        }
        case path === '/backup': {
            fs.readdir('./backup', (err, files) => {
                response.setHeader('Content-Type', 'application/json');
                let json = [];
                for (let i = 0; i < files.length; i++) {
                    json.push({
                        id: i,
                        name: files[i]
                    });
                }
                response.end(JSON.stringify(json));
                console.log(files.length);
            });
        }
    }
};