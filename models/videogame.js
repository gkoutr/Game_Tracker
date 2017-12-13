var mongoose = require('mongoose');


var videogameSchema = new mongoose.Schema({
  title: String,
  console: String,
  condition: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Videogame", videogameSchema);