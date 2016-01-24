/**
 * Created by tungnd on 01/11/2015.
 */
var mongoose = require ("mongoose");
var Schema = mongoose.Schema;
// create a schema
var ServicePackageSchema = new Schema({
    _id: { type: Number, index: true, default: 0},
    server_service_id: Number,
    name: String,
    is_free: Boolean,
    is_expire_date: Boolean,
    value_index: Number,
    sort: Number,
    active: Boolean,
    is_view_record: Boolean,
    view_record_day: Number,
    is_default_add: Boolean
});

ServicePackageSchema.pre('save', function(next) {
    var self = this;
    if(self._id==0){
        mongoose.connection.db.eval("getNextSequence('service_packages')",function(err,count){
            if(err) self._id = 0;
            self._id = count;
            next();
        });
    }
});

var ServicePackage = mongoose.model('service_packages', ServicePackageSchema);

module.exports = ServicePackage;