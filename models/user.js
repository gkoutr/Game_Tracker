var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videogame"
    }
});

module.exports = mongoose.model("User", userSchema);