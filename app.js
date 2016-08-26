var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io').listen(server);

    server.listen(process.env.PORT || 3000);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var num = 0;
//wut
app.get('/', function (req, res) {
    res.sendfile('./index.html');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));
// http.listen(3000, function () {
//     console.log('listening on *:3000');
//
// });

fs.readFile('./num.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    num = parseInt(data);
});
io.sockets.on('connection', function(socket){
    io.sockets.emit('update', num);
    fs.readFile('./num.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        num = parseInt(data);
    });
    socket.on('plus', function() {
        num++;
        fs.writeFile('./num.txt', '' + num, function (err) {
            if (err) return console.log(err);
        });
        io.sockets.emit('update', num);

    });
    socket.on('minus', function() {
        num--;
        fs.writeFile('./num.txt', '' + num, function (err) {
            if (err) return console.log(err);
        });
        io.sockets.emit('update', num);

    });
});
module.exports = app;