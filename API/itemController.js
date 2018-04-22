

app.get("/api/items/getItems", function(req, res){
    console.log(req.user._id);
    Videogame.find({}, function(err, response, body){
      
      //var json = JSON.parse(body);
      res.send(response);
    })
  });