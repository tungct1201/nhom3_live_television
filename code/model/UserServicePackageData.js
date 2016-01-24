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
var UserServicePackageSchema = new Schema({
	_id: { type: Number, index: true, default: 0},
	service_package_id: Number,
	user_id: String,
	is_expire_date: Boolean,
	expire_date: Date,
	active: Boolean
});

UserServicePackageSchema.pre('save', function(next) {
	var self = this;
	if(self._id==0){
		mongoose.connection.db.eval("getNextSequence('user_service_packages')",function(err,count){
			if(err) self._id = 0;
			self._id = count;
			next();
		});
	}
});

var UserServicePackage = mongoose.model('user_service_packages', UserServicePackageSchema);

module.exports = UserServicePackage;