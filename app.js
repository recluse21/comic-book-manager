var exports = module.exports = {};
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var crypto = require('crypto');
var firebase = require('firebase');

var admin = require("firebase-admin");
var configData = require('./configData.json');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: configData.databaseURL
});

var db = admin.database();

var config = {
    apiKey: configData.apiKey,
    authDomain: configData.authDomain,
    databaseURL: configData.databaseURL,
    storageBucket: configData.storageBucket
};
firebase.initializeApp(config);


// Route files
var routes = require('./routes/index');
var comics = require('./routes/comics');
var search = require('./routes/search');
var users = require('./routes/users');

// Init app
var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// logger
app.use(logger('dev'));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle sessions
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));

// Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// connect flash
app.use(flash());

// global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // res.locals.authdata = firebase.auth().currentUser; 
    // res.locals.page = req.url;
    res.locals.currentYear = new Date().getFullYear();
    next();
});

// routes
app.use('/', routes);
app.use('/comics', comics);
app.use('/search', search);
app.use('/users', users);

// Set port
app.set('port', (process.env.PORT || 3000));

// Run server
app.listen(app.get('port'), function(){
    console.log('Server started on port: '+ app.get('port'));
});

var ts = new Date();
console.log(`time stamp: ${ts}`);
var data = `${ts}${configData.privateApi}${configData.marvelApiKey}`;

var hash = crypto.createHash('md5').update(data).digest("hex");
console.log(`New hash: ${hash}`);