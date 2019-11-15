const fs = require('fs');
const url = require('url');

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
                                    response.end('Error');
                                } else {
                                    console.log('Student is altered');
                                    response.end(JSON.stringify(JSON.parse(body)));
                                }
                            });
                            flag = true;
                        }
                    }
                    if(!flag) {
                        response.setHeader('Content-Type', 'text/plain');
                        response.end(`Student with id = ${JSON.parse(body).id} does not exist`);
                    }
                });
            });
            break;
        }
    }
};