const fs = require('fs');
const url = require('url');
const err_handler = require('./error_handler');

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
                    let flag = false;
                    let json = JSON.parse(data.toString());
                    for (let i = 0; i < json.length; i++) {
                        if (json[i].id === JSON.parse(body).id) {
                            json[i] = JSON.parse(body);
                            fs.writeFile(file_path, JSON.stringify(json), (e) => {
                                if (e) {
                                    console.log('Error');
                                    err_handler(request, response, e.code, e.message);
                                } else {
                                    console.log('Student is altered');
                                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                    response.end(JSON.stringify(JSON.parse(body)));
                                }
                            });
                            flag = true;
                        }
                    }
                    if(!flag) {
                        err_handler(request, response, 1, `Student with id = ${JSON.parse(body).id} doesn't exist`);
                    }
                });
            });
            break;
        }
    }
};