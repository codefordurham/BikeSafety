var express = require('express'),
    favicon = require('serve-favicon'),
    static = require('serve-static'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    routes = require('./routes/GUI.js'),
    path = require('path'),
    nconf = require('nconf');

nconf.env().file({ file: 'settings.json' });

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'html/src'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(static(path.join(__dirname, 'html/includes')));

routes(app);

if (app.settings.env == 'development')
    app.use(errorHandler());

module.exports = app;