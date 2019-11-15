const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const file_path = './static_files/StudentList.json';

module.exports = (request, response) => {
    let path = url.parse(request.url).pathname;
    switch(path) {
        case '/': {
            let body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                fs.readFile(file_path, (err, data) => {
                    let flag = true;
                    let json = JSON.parse(data.toString());
                    for (let i = 0; i < json.length; i++) {
                        if (json[i].id === JSON.parse(body).id) {
                            flag = false;
                        }
                    }
                    if(flag) {
                        json.push(JSON.parse(body));
                        fs.writeFile(file_path, JSON.stringify(json), (e) => {
                            if (e) {
                                console.log('Error');
                                response.end('Error');
                            } else {
                                console.log('Student is added');
                                response.end(JSON.stringify(JSON.parse(body)));
                            }
                        });
                    } else {
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(`Student with id = ${JSON.parse(body).id} exists`);
                    }
                });
            });
            break;
        }
        case '/backup': {
            let date = new Date();
            fs.copyFile(file_path, `./backup/${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}_StudentList.json`, (err) => {
                if (err) {
                    console.log('Error');
                    response.end('Error');
                } else {
                    console.log('File is copied');
                    response.end('Ok');
                }
            });
            break;
        }
    }
};