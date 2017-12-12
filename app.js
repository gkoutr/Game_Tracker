var express = require('express');
var mongoose = require("mongoose");
var nodeadmin = require('nodeadmin');
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var app = express();
var User = require("./models/user");
var Videogame = require("./models/videogame");

mongoose.connect("mongodb://localhost/item_tracker_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("styles"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

/*Videogame.create({
  name: "Super Smash Bros.",
  console: "Nintendo 64",
  used: "true"
}, function(err, game){
  if(err){
    console.log(err);
  } else {
    console.log(game);
  }
});*/

app.get('/', function (req, res) {
  res.redirect("/items");
})

//INDEX ROUTE
app.get('/items', function (req, res){
  res.render("index");
});

app.get("/items/new", function(req, res){
  res.render("new");
});

//Create route
app.post("/items", function(req, res){
  req.body.game.body = req.sanitize(req.body.game.body);
  Videogame.create(req.body.game, function(err, newGame){
    if(err){
      res.render("new");
    } else {
      res.redirect("/items");
    }
  })
})

//SHOW ROUTE
app.get("/items/show", function(req, res){
  Videogame.find({}, function(err, games){
    if(err){
      console.log("ERROR!");
    } else {
      res.render("show", {games: games});
    }
  })
})

//DESTROY ROUTE
app.delete("/items/show/:id", function(req, res){
  Videogame.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect("/items/show");
    } else {
      res.redirect("/items/show");
    }
  })
})

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