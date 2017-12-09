var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var ejs = require('ejs');
global.webshot = require('webshot');

var app = express();

// view engine setup
app.engine('html',ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/login',index); // 即为为路径 /login 设置路由
app.use('/register',index); // 即为为路径 /register 设置路由
app.use('/home',index); // 即为为路径 /home 设置路由
app.use('/home/get_note',index); // 即为为路径 /home 设置路由
app.use("/logout",index); // 即为为路径 /logout 设置路由
app.use("/manager",index);
app.use("/information",index);
app.use("/form",index);

// sessionStore = new session.MemoryStore();
// app.use(connect.session({
//     secret: 'test',
//     name:"user",
//     cookie:{
//         maxAge: 1000*60*30
//     },
//     store:sessionStore,
//     resave: true, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
// }));

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

var sqlite3 = require('sqlite3');
global.db = new sqlite3.Database('my_notebook.db');

// db.each("select * from user where id=\"001\"", function (err, row) {
//     console.log("id = " + row.id + "   passwd = " + row.passwd);
// });

// webshot('/lonin', 'google.png', {siteType:'html'}, function(err) {
//     // screenshot now saved to google.png
// });
var options = {
    screenSize: {
        width: 1320
        , height: 700
    }
    , shotSize: {
        width: 1320
        , height: 'all'
    }
};
// var webshot = require('webshot');
// webshot('http://localhost:3000/home/add', '../../test.png',options, function(err) {
//     // screenshot now saved to google.png
// });

// webshot('<html><body>Hello World</body></html>', 'hello_world.png', {siteType:'html'}, function(err) {
//     // screenshot now saved to hello_world.png
// });

module.exports = app;
