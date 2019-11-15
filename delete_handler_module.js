const fs = require('fs');
const url = require('url');

const file_path = './static_files/StudentList.json';

module.exports = (request, response) => {
    let path = url.parse(request.url).pathname;
    switch (true) {
        case /\/backup\/\d+/.test(path): {
            let flag = false;
            fs.readdir('./backup', (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    if (files[i].match(/\d{8}/)[0] > Number(path.match(/\d+/))) {
                        flag = true;
                        fs.unlink(`./backup/${files[i]}`, (e) => {
                            if (e) {
                                console.log('Error');
                                response.end('Error');
                            } else {
                                console.log('Ok');
                                response.end('Ok');
                            }
                        });
                    }
                }
                if (!flag) {
                    response.setHeader('Content-Type', 'text/plain');
                    response.end('No files');
                }
            });
            break;
        }
        case /\/\d+/.test(path): {
            fs.readFile(file_path, (err, data) => {
                let json = JSON.parse(data.toString());
                for (let i = 0; i < json.length; i++) {
                    if (json[i].id === Number(path.match(/\d+/)[0])) {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                        delete json[i];
                    }
                }
                fs.writeFile(file_path, JSON.stringify(json), (e) => {
                    if (e) {
                        console.log('Error');
                        response.end('Error');
                    } else {
                        console.log('Ok');
                        response.end('Ok');
                    }
                });
                response.end();
            });
        }
    }
};