var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var  bodyParser = require('body-parser');
var methodOverride = require('method-override');
var servicepackage = require('../model/ServicePackageData');
var Packageday = require('../model/PackagedayData.js');
var Cardnumber = require('../model/CardnumberData');
var ServicePackagedayLL = require('../model/ServicePackagedayLL');
var UserServicePackageData = require('../model/UserServicePackageData');
var util = require('../util/util.js');
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
var sess;
var data;
var data_package;
var data_package_add;
router.route('/')
    .post(function(req, res) {
        var package =  req.body.package;
        var package_add =  req.body.package_add;
      //  res.contentType('json');
     //   res.send(JSON.stringify({"error":"14","data":"gia tri"+package+"--"+package_add}));
        if(package==undefined||package==0){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({"error":"14","data":"Gói cơ bản là bắt buộc"}));
        }
        else{
            Packageday.findOne({_id:package}).select('_id name price day').exec(function(err,packageday_info){
                if(err){
                    res.contentType('json');
                    res.send(JSON.stringify({"error":"12","data":"Không lấy được dữ liệu"}));
                }
                if(packageday_info){
                    data_package= {"_id":packageday_info._id,"name": packageday_info.name,"price": packageday_info.price.toString(),"month": packageday_info.day.toString()};
                    if(package_add==undefined||package_add==0){
                        res.contentType('json');
                        data= {"error":"0","data":[data_package]};
                        res.send(JSON.stringify(data));
                    }
                    else{
                        Packageday.findOne({_id:package_add}).select('_id name price day').exec(function(err,packagedayadd_info) {
                            if (err) {
                                res.writeHead(200, {"Content-Type": "application/json"});
                                res.end(JSON.stringify({"error":"12","data":"Không lấy được dữ liệu"}));
                            }
                            if (packagedayadd_info) {
                                data_package_add={"_id":packagedayadd_info._id,"name": packagedayadd_info.name,"price": packagedayadd_info.price.toString(),"month": packagedayadd_info.day.toString()};
                                data = {"error":"0","data":[data_package,data_package_add]};
                                res.contentType('json');
                                res.send(JSON.stringify(data));
                            }
                            else{
                                res.contentType('json');
                                res.end(JSON.stringify({"error":"13","data":"Không tìm thấy thông tin gói thể thao"}));
                            }
                        });
                    }
                }
                else{
                    res.contentType('json');
                    res.send(JSON.stringify({"error":"13","data":"Không tìm thấy thông tin gói cơ bản"}));
                }
            });
        }

    });
router.post('/pay', function(req, res) {
    sess==req.session;
    var number = util.randomString(8).toUpperCase();
    var serial=util.randomString(6).toUpperCase();
    var cardnumber = new Cardnumber();
    cardnumber.server_id =1;
    cardnumber.user_create=2;
    cardnumber.number=number;
    cardnumber.serial = serial;
    cardnumber.user_create =sess.user_id;
    cardnumber.user_id=sess.user_id;
    cardnumber.token="";
    cardnumber.save(function(err,card_info){
        if(err){
            res.contentType('json');
            res.send(JSON.stringify({"error":"12","data":"Server đang bận xin vui lòng thử lại sau"}));
        }
        else{
            var card_id = card_info._id;
            var date_created = util.date2String(card_info.created_at);
            var token_card = util.getTokenCard(1,card_id,card_info.number,card_info.serial,date_created,card_info.capacity,'1102');
            Cardnumber.update(
                {_id:card_info._id},
                {token:token_card},
                function(err,data_affected){
                    if(err){
                        res.contentType('json');
                        res.send(JSON.stringify({"error":"12","data":"Server đang bận xin vui lòng thử lại sau"}));
                    }
                    if(data_affected.n>0){
                        ServicePackagedayLL.findOne({package_day_id:data_package._id}).select('_id service_package_id').exec(function(err,ServicePackagedayLL_info){
                            if(err){
                                res.send('server đang bận xin vui lòng thử lại sau');
                            }
                            if(ServicePackagedayLL_info){
                                var UserServicePackage = new UserServicePackageData();
                                UserServicePackage.service_package_id = ServicePackagedayLL_info.service_package_id;
                                UserServicePackage.user_id = sess.user_id;
                                var expire_date = new Date();
                                expire_date.setDate(expire_date.getDate()+data_package.month);
                                UserServicePackage.expire_date = expire_date;
                                UserServicePackage.is_expire_date=1;
                                UserServicePackage.active=true;
                                UserServicePackage.save(function(err,info_user){
                                    if(err){
                                        res.contentType('json');
                                        res.send(JSON.stringify({"error":"12","data":"Server đang bận xin vui lòng thử lại sau"}));
                                    }
                                    else{
                                        res.contentType('json');
                                        res.send(JSON.stringify({"error":"0","data":"Pakage_id"+data_package._id +" card:"+number+" user_id"+info_user._id}));
                                    }
                                });

                            }
                        });
                    }
                    else{
                        res.contentType('json');
                        res.send(JSON.stringify({"error":"11","data":"Không cập nhật được token"}));
                    }
                });



        }
    });

});
router.get('/', function(req, res, next) {
     sess=req.session;

     if(sess.email)
      {
        Packageday.find({show_user:"1"}).select('_id name').exec(function(err,Packageday_base_info){
            if(err){
                res.send('server error');
            }
            if(Packageday_base_info){
                    Packageday.find({show_user:"2"}).select('_id name').exec(function(err,Packageday_sport_info){
                                if(err){
                                    res.send('server error');
                                }
                                if(Packageday_sport_info){
                                    res.render('payment/index', {
                                        title: 'Register service',
                            Packageday_base_info:Packageday_base_info,
                            Packageday_sport_info:Packageday_sport_info
                        });
                    }
                });
            }
            else{
                res.send('Password or email incorec');
            }
        });
      }
      else
      {
      //   res.render('payment/index', {
        //    title: 'Register service',
          //   message:''
       // });
         res.render('register/index', {
         title: 'Register info',
         message:''
     });
      }

});
module.exports = router;