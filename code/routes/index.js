var express = require('express');
var router = express.Router();
var users = require('../model/UserData');
/* GET home page. */
var sess;
router.get('/', function(req, res, next) {
  sess=req.session;
  if(sess.email)
  {
      res.render('payment/index', { title: '' });
  }
  else
  {
    res.render('index', { title: '' });
  }
});
router.route('/')
.post(function(req, res) {
      var email = req.body.email;
      var password = req.body.password;
      sess=req.session;
      users.findOne({email:email,password:password}).select('_id').exec(function(err,users_info){
        if(err){
              res.send('server error');
        }
        if(users_info){
              sess.email=req.body.email;
              sess.user_id=users_info._id;
              res.writeHead(302, {'Location': 'payment'});
              res.end();
        }
        else{
            res.send('Password or email incorec');
        }
      });
});
module.exports = router;
