var mongoose = require ("mongoose");
// var config = require('../config/config');
//var async = require('async');

// mongoose.set('debug', true);
// var connection = mongoose.connect(config.mongo_connect);

var Schema = mongoose.Schema;

/*
 Type:
 String
 Number
 Date
 Buffer
 Boolean
 Mixed
 Objectid
 Array
 */

// create a schema
var ServicePackagedayLLSchema = new Schema({
    _id: { type: Number, index: true, default: 0},
    service_package_id: {type:Number,require:true},
    package_id: {type: Number, require: true},
    day: Number
});

ServicePackagedayLLSchema.pre('save', function(next) {
    var self = this;
    if(self._id==0){
        mongoose.connection.db.eval("getNextSequence('service_package_day_ll')",function(err,count){
            if(err) self._id = 0;
            self._id = count;
            next();
        });
    }
});

var ServicePackagedayLL = mongoose.model('service_package_day_ll', ServicePackagedayLLSchema,'service_package_day_ll');

module.exports = ServicePackagedayLL;