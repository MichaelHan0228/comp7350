var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var session = require('express-session');
var connect = require('connect');
var multipart = require('connect-multiparty');

var app = express();


//获取model（user）
app.use(session({ 
  secret: 'secret',
  cookie:{ 
      maxAge: 1000*60*30
  }
}));
app.use(function(req,res,next){ 
  res.locals.user = req.session.user;   // 从session 获取 user对象
  var err = req.session.error;   //获取错误信息
  delete req.session.error;
  res.locals.message = "";   // 展示的信息 message
  if(err){ 
      res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();  //中间件传递
});

//封装路由
var index = require('./routes/index');
var users = require('./routes/users');
//封装路由

// 连接数据库database
global.dbHandle = require('./models/userHandle');
global.db = mongoose.connect('mongodb://7350group:123456@ds231719.mlab.com:31719/7350');
//测试数据库是否链接成功
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('数据库链接成功')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//首页，普通用户注册登录  
app.use('/', index);//默认进入首页
app.use('/users', users);
app.use('/login',index); // 即为为路径 /login 设置路由
app.use('/register',index); // 即为为路径 /register 设置路由
app.use('/afterLogin',index); // 即为为路径 /home 设置路由
app.use("/logout",index); // 即为为路径 /logout 设置路由




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
  res.render('error');
});


// 下边这里也加上 use(multer)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer);
app.use(cookieParser());

module.exports = app;
