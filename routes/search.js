var express = require('express');
var router = express.Router();
var configData = require('../configData.json');
var crypto = require('crypto');
const request = require('request');

router.get('/', function(req, res, next) {
    res.render('search/index');
});

var ts = new Date();
console.log(`time stamp: ${ts}`);
var data = `${ts}${configData.privateApi}${configData.marvelApiKey}`;

var hash = crypto.createHash('md5').update(data).digest("hex");
console.log(`New hash: ${hash}`);

var getComics = (/* search parameters here */) => {
    request({
        url: `http://gateway.marvel.com/v1/comics?title=&issueNumber=&ts=${ts}&apikey=${configData.marvelApiKey}&hash=${hash}`,
        json: true
    }, (error, response, body) => {
        if (!error && response.code === 200) {
            callback(undefined, {
                /* search data results here */
            });
        }
        else {
            callback('Unable to fetch results.');
        }
    });
};

module.exports.getComics = getComics;
module.exports = router;