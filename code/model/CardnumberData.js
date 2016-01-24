/**
 * Created by tungnd on 01/11/2015.
 */
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
var CardnumberSchema = new Schema({
    _id: { type: Number, index: true, default: 0},
    number: { type: String, unique: true, required: true},
    serial: { type: String, unique: true, required: true},
    server_id: {type: Number, default: 1},
    capacity: {type: Number, default: 0},
    user_id: Number,
    use_date: Date,
    free_day: Number,
    note: String,
    token: String,

    user_create: {type: Number, required: true},
    status: {type: Boolean, default: true},
    active: {type: Boolean, default: true},

    is_lock: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    user_delete: Number,
    date_delete: Date,

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

CardnumberSchema.pre('save', function(next) {
    var self = this;
    var currentDate = new Date();
    self.updated_at = currentDate;
    if (!self.created_at) self.created_at = currentDate;

    if(self._id==0){
        mongoose.connection.db.eval('getNextSequence(\'cardnumber\')',function(err,seq){
            if(err) self._id = 0;
            self._id = seq;
            next();
        });
    }
});

var Cardnumber = mongoose.model('cardnumbers', CardnumberSchema,'cardnumbers');

module.exports = Cardnumber;