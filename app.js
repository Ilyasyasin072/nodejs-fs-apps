var express = require('express');
var createError = require('http-errors');
var ServerIndex = require('./routes/app');
var Home = require('./routes/home');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static('public'));
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json({
    limit: "8mb",
  }));
  
  app.use('/', ServerIndex);
  
  app.use('/home', Home)

  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  io.on('connection', function(socket){
    console.log('a user connected');
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    // res.render('error');
  });
  
  module.exports = app;