global.__basedir = __dirname;
const http = require('http');
const hostname = process.env.IP;
const port = process.env.PORT  || 3000;
var express = require('express');
var app = express();
var mongoose = require("mongoose");
//var nodeadmin = require('nodeadmin');
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var igdb = require('igdb-api-node').default;
var client = igdb('0d0a1c9e8d9fa2c618b5612f1f5a27d7');
var User = require("./models/user");
var Videogame = require("./models/videogame");
var igdbAPI = require('./API/igdb/test');
var request = require('request');

var url = process.env.DATABASEURL || "mongodb://localhost/item_tracker_app";
//var url = "mongodb://george:password123@ds121171.mlab.com:21171/item-price-tracker";
mongoose.connect(url);
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("styles"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use('/', express.static(__basedir));
app.use("/awesomplete", express.static(__basedir + '/node_modules/awesomplete'));

app.get('/', function (req, res) {
  res.redirect("/items");
})

//INDEX ROUTE
app.get('/items/goals', function (req, res){
  res.render("goals");
  
});

app.get("/api", function(req, res){
  res.render("search"); 
});

app.get('/api/results', function(req, res){
  console.log(req.query.search)
  var query = req.query.search;
  var options = {
    url:'https://api-2445582011268.apicast.io/games/?search=' + query + '&fields=*' ,
    headers: {
      'user-key': '0d0a1c9e8d9fa2c618b5612f1f5a27d7',
       'Accept': 'application/json'
    }
  }
    request(options, function (error, response, body) {
      if(!error && response.statusCode == 200){
        var data = JSON.parse(body)
        res.render("results", {data: data});
    }
  });
});

//SHOW All GAMES ROUTE
app.get("/items", isLoggedIn, function(req, res){
  var userGames = [];
      res.render("index", {userGames: userGames});
      
});

//NEW ROUTE
app.get("/items/new", isLoggedIn, function(req, res){
  res.render("new");
});

//EDIT ROUTE
app.get("/items/:id/edit", function(req, res){
    res.render("edit");
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

//API ROUTES
var priceProduct = {
  host: 'https://www.pricecharting.com/api/product?t=8ee1e21e4768301330683b9a8f010dc7c0f20e94',
  path: '/items/api/itemprice',
  headers: {'User-Agent': 'request'}
};

//Get All Items by user
app.get("/items/api/getItems", isLoggedIn, function(req, res){
  var userGames = [];
  Videogame.find({}, function(err, games){
    for(var x = 0; x < games.length; x++){
      if (games[x].owner.id.equals(req.user._id)){
        userGames.push(games[x]);    
      }
    }
    res.send(userGames);
    
  })
});

//pricecharting search single product
app.get("/items/api/search/itemprice/:fq", function(req,res){
  var query = req.params.fq;
  request('https://www.pricecharting.com/api/product?t=8ee1e21e4768301330683b9a8f010dc7c0f20e94&q=' + query, function (error, response, body){
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      // do more stuff
      res.send(info);
    }
  })
});

//pricecharting search multiple products
app.get("/items/api/search/products/:fq", function(req, res){
  var query = req.params.fq;
  request('https://www.pricecharting.com/api/products?t=8ee1e21e4768301330683b9a8f010dc7c0f20e94&q=' + query, function (error, response, body){
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      var gameNames = [];
      for(var x = 0; x < info.products.length; x++){
        gameNames.push(info.products[x]["product-name"]);
        debugger;
      }
      // do more stuff
      res.send(gameNames);
    }
  })
})

app.get("/api/items/:id/edit", isLoggedIn, function(req, res){
  Videogame.findById(req.params.id, function(err, game){
    res.json(game);
  })
})

//DESTROY ROUTE
app.delete("/items/api/:id", function(req, res){
  Videogame.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect("/items");
    } 
    else {
      res.json(req.params.id);
    }
    
  })
})

//Create route
app.post("/items/api/saveGame", function(req, res){
 var fields = req.body;
 var newGames = [];
 var owner = {
  id: req.user._id,
  username: req.user.username
}
 for(var x = 0; x < fields.length; x++){
  newGames.push({title: fields[x].title, console: fields[x].console, condition: fields[x].condition, owner: owner});
 }
  Videogame.create(newGames, function(err, newlyCreated){
        if(err){
          console.log(err);
        }
        else {
          res.json(newlyCreated);
        }
  });
})
 
//UPDATE ROUTE
app.post("/api/items/:id", function(req,res){
  Videogame.findByIdAndUpdate(req.body._id, req.body, function(err, updatedGame){
    if(err){
      res.send(err);
    }
    else{
      res.json(updatedGame.id);
    }
  });
})

app.listen(port, hostname,  function(){
  console.log(port + " " + hostname);
    console.log("app Has Started!");
});