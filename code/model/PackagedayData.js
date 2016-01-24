/**
 * Created by tungnd on 01/11/2015.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PackagedaySchema = new Schema({
    _id: { type: Number, index: true, default: 0},
    name: String,
    price: Number,
    unit_id: Number,
    unit_name: String,
    is_show: {type: Boolean, default: false},
    int_index: Number,
    free_day: Number,
    sort:Number,
    active:  {type: Boolean, default: false},
    server_id: Number,
    show_user: Number,
    day: Number,
    Promotion_day: Number
});
PackagedaySchema.pre('save', function(next) {
    var self = this;
    if(self._id==0){
        mongoose.connection.db.eval("getNextSequence('Packages_day')",function(err,count){
            if(err) self._id = 0;
            self._id = count;
            next();
        });
    }
});
var Packageday = mongoose.model('Packages_day', PackagedaySchema,'Packages_day');
module.exports = Packageday;