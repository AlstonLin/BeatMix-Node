var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var songSchema = mongoose.Schema({
  title : String,
  content : String,
  author: String
});
module.exports = mongoose.model('Song', songSchema);
