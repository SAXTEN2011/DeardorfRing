var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var num = 0;
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
http.listen(8080, function () {
    console.log('listening on *:3000');

});
//hithere
fs.readFile('./num.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    num = parseInt(data);
});
io.on('connection', function(socket){
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