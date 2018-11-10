var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var stream = require('./routes/stream');
//var models = require('./models/index');
var mongoose = require('mongoose');
var session = require('express-session');
var admin = require('./routes/admins');
var compressor = require('node-minify');

mongoose.Promise = require('q').Promise;

var app = express();

app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('views', __dirname);
app.set('view engine', 'jade');

/**
 * Connect to mongoose server
 */
mongoose.connect('localhost:27017/CSC309-A4'); // change this when you put it online

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('Now running');
});

//after we put the db online
//mongoose.connect('link', {
//    user: 'user',
//    pass: '[ass'
//});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session({
	secret: 'shhhhhhhh',
}));

app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.user = req.session.user || null;
    next();
});
app.use('/', routes);
app.use('/user', users);
app.use('/stream', stream);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
