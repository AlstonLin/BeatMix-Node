var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sessionSchema = mongoose.Schema({
  code : String
});
module.exports = mongoose.model('Session', sessionSchema);
