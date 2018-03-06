global.__basedir = __dirname;
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
var igdb = require('igdb-api-node').default;
var client = igdb('0d0a1c9e8d9fa2c618b5612f1f5a27d7');
var User = require("./models/user");
var Videogame = require("./models/videogame");
var igdbAPI = require('./API/igdb/test');
var request = require('request');
var igdbURL = 'https://api-2445582011268.apicast.io/games/'

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
        console.log(data);
        res.render("results", {data: data});
    }
  });
});




app.get("/items/new", isLoggedIn, function(req, res){
  // Videogame.findById(req.params.id, function(err, game){
  //   if(err){
  //     console.log(err);
  //   } else{
  //     res.render("new", {game: game});
  //   }
  // })
  res.render("new");
});

//Create route
// app.post("/items", isLoggedIn, function(req, res){
//   req.body.game.body = req.sanitize(req.body.game.body);
//   var title = req.body.game.title;
//   var system = req.body.game.console;
//   var condition = req.body.game.condition;
//   var owner = {
//       id: req.user._id,
//       username: req.user.username
//   }
//   var newGame = {title: title, console: system, condition: condition, owner: owner}
//   Videogame.create(newGame, function(err, newlyCreated){
//     if(err){
//       console.log(err);
//     }
//     else {
//       res.redirect("/items");
//     }
//   });
  
// });

//SHOW All GAMES ROUTE
app.get("/items", isLoggedIn, function(req, res){
  var userGames = [];
  // Videogame.find({}, function(err, games){
  //   if(err){
  //     console.log("ERROR!");
  //   } else {
  //     for(var x = 0; x < games.length; x++){
  //       if (games[x].owner.id.equals(req.user._id)){
  //         userGames.push(games[x]);
  //       }
  //     }
      res.render("index", {userGames: userGames});
      
});


//EDIT ROUTE
app.get("/items/:id/edit", function(req, res){
  // Videogame.findById(req.params.id, function(err, foundGame){
  //   if(err){
  //     res.redirect("/items");
  //   } else {
  //      res.render("edit", {game: foundGame});
  //     //res.json(req.params.id);
  //   }
    res.render("edit");
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


// //DESTROY ROUTE
// app.delete("/items/:id", function(req, res){
//   Videogame.findByIdAndRemove(req.params.id, function(err){
//     if (err){
//       res.redirect("/items");
//     } else {
//       res.redirect("/items");
//     }
//   })
// })

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

// app.get("/items/:id/edit", function(req, res){
//   Videogame.findById(req.params.id, function(err, foundGame){
//     if(err){
//       res.redirect("/items");
//     } else {
//        res.render("edit", {game: foundGame});
//       //res.json(req.params.id);
//     }
//   });
// })

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
  var title = req.body.title;
  var system = req.body.console;
  var condition = req.body.condition;
  var owner = {
    id: req.user._id,
    username: req.user.username
  }
  var newGame = {title: title, console: system, condition: condition, owner: owner}
  Videogame.create(newGame, function(err, newlyCreated){
        if(err){
          console.log(err);
        }
        else {
          res.json(newlyCreated.id);
        }
  });
})
 
app.listen(port, hostname, function(){
    console.log("app Has Started!");
});