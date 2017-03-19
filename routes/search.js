var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const request = require('request');

router.get('/', function(req, res, next) {
    res.render('search/index');
});


var getComics = (/* search parameters here */) => {
    request({
        url: ``,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
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