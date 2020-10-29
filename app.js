var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();


var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5mb'}));
//

app.use(express.static(path.join(__dirname, 'public')));
//SESSIONS
var session = require('express-session');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: false }
}));

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = false // serve secure cookies
  sess.cookie.httpOnly = false
}

app.use(session(sess));

app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}))
//////////

const fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//ROUTEUR
app.use('/', require('./routes/index'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/addArticle', require('./routes/addArticle'));
app.use('/postAvis', require('./routes/postAvis'));

app.use('/API/user/register', require('./routes/API/user/register'));
app.use('/API/user/login', require('./routes/API/user/login'));
app.use('/API/user/logout', require('./routes/API/user/logout'));
app.use('/API/user/update', require('./routes/API/user/update'));
app.use('/API/user/read', require('./routes/API/user/read'));

app.use('/API/article/create', require('./routes/API/article/create'));
app.use('/API/article/read', require('./routes/API/article/read'));
app.use('/API/article/delete', require('./routes/API/article/delete'));
app.use('/API/article/update', require('./routes/API/article/update'));

app.use('/API/article/image/create', require('./routes/API/article/image/create'));
app.use('/API/article/image/read', require('./routes/API/article/image/read'));
app.use('/API/article/image/delete', require('./routes/API/article/image/delete'));
app.use('/API/article/image/update', require('./routes/API/article/image/update'));

app.use('/API/avis/create', require('./routes/API/avis/create'));
app.use('/API/avis/read', require('./routes/API/avis/read'));
app.use('/API/avis/delete', require('./routes/API/avis/delete'));
app.use('/API/avis/update', require('./routes/API/avis/update'));

app.use('/API/message/create', require('./routes/API/message/create'));
app.use('/API/message/read', require('./routes/API/message/read'));
app.use('/API/message/delete', require('./routes/API/message/delete'));
app.use('/API/message/update', require('./routes/API/message/update'));

app.use('/API/search', require('./routes/API/search'));
app.use('/API/newArticle', require('./routes/API/article'));


//////


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
