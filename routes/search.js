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

// Search for comics to add to collection using the Marvel API
router.post('/results', function(req, res, next) {
    var title = req.body.title;
    var issue = req.body.issueNum;

    // validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('issueNum').optional({ checkFalsy: true }).isInt();

    var errors = req.validationErrors();

    if(errors) {
        console.log('There are errors:', errors)
        res.render('search/index'), {
            errors: errors
        };
    } else {

        // build search url
        var ts = new Date();
        var data = `${ts}${configData.privateApi}${configData.marvelApiKey}`;
        var hash = crypto.createHash('md5').update(data).digest("hex");
        // console.log('&ts=', ts);
        // console.log('&apikey=', configData.marvelApiKey);
        // console.log('&hash=', hash);

        var issueNumber;
        if (req.body.issueNum != '') {
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
                // console.log(`https://gateway.marvel.com/v1/public/comics?titleStartsWith=${title}${issueNumber}&orderBy=onsaleDate&apikey=${configData.marvelApiKey}&ts=${ts}&hash=${hash}`);
                // console.log('Search results: ', body);
                 res.render('search/results', {comics: body, title: title, issue: issue});
            }

        });
                
    }
});

// add new comic from search results
router.post('/add', function(req, res, next) {

    var comicNotes = ' ';

    // Build comic Object
    var comic = {
        title: req.body.title,
        issue: req.body.issueNum,
        writer: req.body.writer,
        artist: req.body.artist,
        info: req.body.info,
        year: req.body.year,
        notes: comicNotes,
        cover: req.body.cover,
        uid: firebase.auth().currentUser.uid
    }

    console.log('This is the comic to be added:', comic);
    // Create Reference 
    var comicRef = db.ref('comics');
    // Push comic
    var newPostRef = comicRef.push(comic);
    // Get the unique key generated by push()
    var postId = newPostRef.key;
    
    res.sendStatus(200);

});


module.exports = router;