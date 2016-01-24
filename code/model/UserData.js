/**
 * Created by tungnd on 01/11/2015.
 */
var mongoose = require('mongoose');
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
var UsersSchema = new mongoose.Schema({
    _id: { type: Number, index: true, default: 0},
    username: { type: String, unique: true},//, required: true
    password: { type: String, select: false},
    fullname: String,
    email: String,
    mobile: String,
    sex: Boolean,
    birthday: Date,

    province_id: Number,
    province_name:String,
    district_id: Number,
    district_name: String,
    address: String,

    code: String,
    setting: String,
    money: {type: Number, default:0},

    package_type: {type: Number, default: 1},
    package_id: Number,

    server_id: {type: Number, default: 1},
    block: {type: Boolean, default: false},
    active: {type: Boolean, default: true},
    deleted: {type: Boolean, default: false},
    created_at: Date,
    updated_at: Date
});
UsersSchema.pre('save', function(next) {
    var self = this;
    var currentDate = new Date();
    self.updated_at = currentDate;
    if (!self.created_at) self.created_at = currentDate;

    if(self._id==0){
        mongoose.connection.db.eval("getNextSequence('users')",function(err,count){
            if(err) self._id = 0;
            self._id = count;
            next();
        });
    }
});

var Users = mongoose.model('users', UsersSchema);

module.exports = Users;