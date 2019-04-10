var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var express      = require('express');
var exphbs       = require('express-handlebars');
var favicon      = require('serve-favicon');
var flash        = require('connect-flash');
var logger       = require('morgan');
var path         = require('path');
var session      = require('express-session');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// Set up favicon, logging, parsing, static files
// Uncomment after placing your favicon in public/images/
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
require('./routes/api.js')(app);

app.use(function (req, res) {
    res.status(404).render('error');
});

module.exports = app;
