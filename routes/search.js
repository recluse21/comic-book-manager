var express = require('express');
var router = express.Router();
var configData = require('../configData.json');
var crypto = require('crypto');
var request = require('request');
var comicSearch = require('../comic_search/comic_search.js');

router.get('/', function(req, res, next) {
    res.render('search/index');
});


router.post('/results', function(req, res, next) {
    var title = req.body.title;
    var issue = req.body.issueNum;

    // validation
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('issueNum', 'Numbers only').isNumeric();

    var errors = req.validationErrors();

    if(errors) {
        res.render('/search'), {
            errors: errors
        }
    } else {

        // build search url
        var ts = new Date();
        console.log(`time stamp: ${ts}`);
        var data = `${ts}${configData.privateApi}${configData.marvelApiKey}`;

        var hash = crypto.createHash('md5').update(data).digest("hex");
        console.log(`New hash: ${hash}`);

        var issueNumber;
        if (issue != null) {
            issueNumber = `&issueNumber=${issue}`;
        } else {
            issueNumber = '';
        }

        var info = [];
        request({
            url: `https://gateway.marvel.com/v1/public/comics?title=${title}${issueNumber}&orderBy=onsaleDate&apikey=${configData.marvelApiKey}&ts=${ts}&hash=${hash}`,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                for(var i=0; i<body.data.count; i++) {
                    info.push({
                        title: body.data.results[i].title,
                        issue: body.data.results[i].issueNumber,
                        description: body.data.results[i].description,
                        cover: body.data.results[i].thumbnail
                    });
                }
                console.log('This is the title:', body.data.results[1].title);
                console.log('This is the search results:',info);
                console.log('The array size is', info.length);
            }
            res.render('search/results', {info: info});
        });
                
    }
});








//module.exports.getComics = getComics;
module.exports = router;