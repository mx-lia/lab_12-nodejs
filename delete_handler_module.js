const fs = require('fs');
const url = require('url');
const err_handler = require('./error_handler');

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
                                err_handler(request, response, e.code, e.message);
                            } else {
                                console.log('Ok');
                                response.end('Ok');
                            }
                        });
                    }
                }
                if (!flag) {
                    err_handler(request, response, 3, 'No files');
                }
            });
            break;
        }
        case /\/\d+/.test(path): {
            fs.readFile(file_path, (err, data) => {
                let json = JSON.parse(data.toString());
                let id = Number(path.match(/\d+/)[0]);
                for (let i = 0; i < json.length; i++) {
                    if (json[i].id === id) {
                        response.setHeader('Content-Type', 'application/json');
                        response.write(JSON.stringify(json[i]));
                        delete json[i];
                        json = json.filter(function(x) {
                            return x !== null;
                        });
                        console.log('Student is deleted');
                    }
                }
                if(!response.hasHeader('Content-Type')) {
                    err_handler(request, response, 1, `Student with id = ${id} doesn't exist`);
                } else {
                    fs.writeFile(file_path, JSON.stringify(json), (e) => {
                        if (e) {
                            console.log('Error');
                            err_handler(request, response, e.code, e.message);
                        } else {
                            response.end();
                        }
                    });
                }
            });
        }
    }
};