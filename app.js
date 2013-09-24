
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , sass = require('node-sass')
  , io = require('socket.io')
  ;

var app = express()
  , server = http.createServer(app)
  , io = io.listen(server)
  ;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());

  app.use(
       sass.middleware({
           src: __dirname + '/sass', //where the sass files are
           dest: __dirname + '/public/stylesheets', //where css should go
           debug: true // obvious
       })
   );
}

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
