const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
var express = require('express');
var app = express();
var mongoose = require("mongoose");
//var nodeadmin = require('nodeadmin');
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require("./models/user");
var Videogame = require("./models/videogame");

mongoose.connect("mongodb://localhost/item_tracker_app");


app.set("view engine", "ejs");

app.use(require("express-session")({
  secret: "Video game session",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass currentUser into every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
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
app.get('/items/goals', function (req, res){
  res.render("goals");
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

//SHOW All GAMES ROUTE
app.get("/items", function(req, res){
  Videogame.find({}, function(err, games){
    if(err){
      console.log("ERROR!");
    } else {
      res.render("index", {games: games});
    }
  })
})

//EDIT ROUTE
app.get("/items/:id/edit", function(req, res){
  Videogame.findById(req.params.id, function(err, foundGame){
    if(err){
      res.redirect("/items");
    } else {
      res.render("edit", {game: foundGame});
    }
  });
})

//UPDATE ROUTE
app.put("/items/:id", function(req,res){
  req.body.game.body = req.sanitize(req.body.game.body);
  Videogame.findByIdAndUpdate(req.params.id, req.body.game, function(err, updatedGame){
    if(err){
     res.redirect("/items");
    } else {
      res.redirect("/items");
    }
  });
})


//DESTROY ROUTE
app.delete("/items/:id", function(req, res){
  Videogame.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect("/items");
    } else {
      res.redirect("/items");
    }
  })
})

// AUTH ROUTES
app.get('/register', function(req, res){
  res.render('register');
})

//handle sign up logic
app.post("/register", function(req, res){
  var newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username
  });
  console.log(req.body.password);
  User.register(newUser, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/items");
      });
  });
})

//show login form
app.get('/login', function(req, res){
  res.render('login');
})

//handling login logic
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/items", 
    failureRedirect: "/login"
  }), function(req, res){
})

//logout route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect('/items');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}
 
app.listen(port, hostname, function(){
    console.log("app Has Started!");
});