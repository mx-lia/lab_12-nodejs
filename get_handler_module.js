const fs = require('fs');
const url = require('url');

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
                for (let i = 0; i < json.length; i++) {
                    if(json[i].id === Number(path.match(/\d+/)[0])) {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                    }
                }
                if(!response.hasHeader('Content-Type')) {
                    response.setHeader('Content-Type', 'text/plain');
                    response.write('No data');
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