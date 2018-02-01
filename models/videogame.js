var mongoose = require('mongoose');


var videogameSchema = new mongoose.Schema({
  title: String,
  console: String,
  condition: String,
  created: {type: Date, default: Date.now},
  owner:{
    id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Videogame", videogameSchema);