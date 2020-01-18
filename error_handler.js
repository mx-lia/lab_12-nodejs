module.exports = (req, res, code, mess) => {
    res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error": "${code}", "message": "${mess}"}`);
};