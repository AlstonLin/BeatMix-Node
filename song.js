var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var songSchema = mongoose.Schema({
  title : String,
  author: String,
  content : String
});
module.exports = mongoose.model('Song', songSchema);
