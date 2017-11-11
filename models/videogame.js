var mongoose = require('mongoose');


var videogameSchema = new mongoose.Schema({
  title: String,
  console: String,
  used: Boolean,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Videogame", videogameSchema);