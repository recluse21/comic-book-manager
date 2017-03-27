var express = require('express');
var router = express.Router();
var configData = require('../configData.json');
var crypto = require('crypto');
var request = require('request');
var firebase = require('firebase');
var admin = require("firebase-admin");

var db = admin.database();

router.get('*', function(req, res, next) {
    // check authentication
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            res.redirect('/users/login');
         } 
        next();
    });
});

router.get('/', function(req, res, next) {
    res.render('search/index');
});


router.post('/results', function(req, res, next) {
    var title = req.body.title;
    var issue = req.body.issueNum;

    // validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('issueNum').optional().isInt();

    var errors = req.validationErrors();

    if(errors) {
        console.log('There are errors:', errors)
        res.render('search/index'), {
            errors: errors
        }
    } else {

/* Search for comics to add to collection using the Marvel API */ 
        // build search url
        var ts = new Date();
        var data = `${ts}${configData.privateApi}${configData.marvelApiKey}`;
        var hash = crypto.createHash('md5').update(data).digest("hex");

        var issueNumber;
        if (req.body.issueNum != null) {
            issueNumber = `&issueNumber=${req.body.issueNum}`;
        } else {
            issueNumber = '';
        }

        var info = [];
        request({
            url: `https://gateway.marvel.com/v1/public/comics?titleStartsWith=${title}${issueNumber}&orderBy=onsaleDate&apikey=${configData.marvelApiKey}&ts=${ts}&hash=${hash}`,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                
                 res.render('search/results', {comics: body, title: title, issue: issue});
            }

        });
                
    }
});

module.exports = router;