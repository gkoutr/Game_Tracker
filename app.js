var express = require('express');
var app = express();
var mongoose = require("mongoose");
var nodeadmin = require('nodeadmin');
var bodyParser = require("body-parser");
/*var User = require("./models/user");
var Videogame = require("./models/videogame");
*/
mongoose.connect("mongodb://localhost/item_tracker_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("styles"));



app.get('/', function (req, res) {
  res.redirect("/items");
})

app.get('/items', function (req, res){
  res.render("index");
});

app.get("/items/new", function(req, res){
  res.render("new");
});

app.get('/login', function(req, res){
  res.render('login');
})

app.get('/register', function(req, res){
  res.render('register');
})

app.use(nodeadmin(app));
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("app Has Started!");
});