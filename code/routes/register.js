var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var  bodyParser = require('body-parser');
var methodOverride = require('method-override');
var utf8 = require('utf8');
/* GET home page. */
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

router.route('/')
    .post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var repassword = req.body.repassword;
        if(password!=repassword){
            res.render('register/index', {
                title: 'Register info',
                message: 'Password not same',
            });
        }
        mongoose.model('users').create({
            username: email,
            password:password,
            email: email
        }, function (err, user) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Blob has been created
                res.render('register/index', {
                    title: 'Register info',
                    message: 'Register success',
                });
            }
        })
       // res.send("email cua ban la:"+ email + password + repassword);
    });
router.get('/', function(req, res, next) {
    res.render('register/index', {
        title: 'Register info',
        message:''
    });
});
module.exports = router;