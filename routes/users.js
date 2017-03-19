var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var admin = require("firebase-admin");

var db = admin.database();

router.get('/register', function(req, res, next) {
    res.render('users/register');
});

router.get('/login', function(req, res, next) {
    res.render('users/login');
});


// register new user
router.post('/register', function(req, res, next) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // validation
    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors) {
        res.render('users/register'), {
            errors: errors
        }
    } else {

        // create new user
        admin.auth().createUser({
            email: email,
            password: password
        })
        .then(function(userData) {
        // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userData.uid);
            var user = {
                uid: userData.uid,
                email: email,
                first_name: first_name,
                last_name: last_name
            }

            // add user data to the database
            var userRef = db.ref().child('users');
            userRef.push().set(user);

            req.flash('success_msg', 'You are now registered and can login');
            res.redirect('/users/login');
        })
        .catch(function(error) {
            console.log("Error creating new user:", error);
        });

    } // end else

});

module.exports = router;