var express = require('express');
var itemController = require('../API/itemController');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");

var router = express.Router();

var User = require("../models/user");
var Videogame = require("../models/videogame");
mongoose.connect("mongodb://localhost/item_tracker_app");

router.route('/items/api/getItems').get(itemController.getItems);

module.exports = router;