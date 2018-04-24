var apiUrl = window.location + "/api";
var game = function(data){
    this.title = ko.observable(data.title);
    this.console = ko.observable(data.console);
    this.condition = ko.observable(data.condition);
}

var itemViewModel = function () {
    var self = this;
    self.games = ko.observableArray([]);
    self.newGame = ko.observable();
    self.firstName = "George";

    self.getEditUrl = function(data){
        return "items/" + data._id + "/edit"
    }

    self.getPriceFromAPI = function(game, callback){
        var url = "https://www.pricecharting.com/api/product?t=8ee1e21e4768301330683b9a8f010dc7c0f20e94&q=" + game.title + " " +  game.console;
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            dataType: 'json',
            success: function (rsp){
             if (callback) callback(rsp, game);
            },
            error: function (err){
                if(callback) callback(err, game, true);
                console.log(err);
            }
        })
    }

    self.deleteGame = function(game){
        var url = apiUrl +  "/" + game._id;
        $('.tiny.modal').modal({
            onDeny : function(){
                $.ajax({
                    type: "DELETE",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function(rsp){
                        setTimeout(function(){
                            self.getItemsByUser();
                        }, 500);


                    },
                    error: function(err){
                        games.pop()
                        console.log(err);
                    }
                })

            }
        }).modal('show');
    }
    self.getItemsByUser = function(callback){
        var url = apiUrl + "/getItems";
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (rsp){
                self.games.removeAll();
                for(var x = 0; x < rsp.length; x++){
                    self.getPriceFromAPI(rsp[x],  function(response, game, error){
                        var loosePrice = ("$" + response['loose-price'] / 100);
                        var newPrice = ("$" + response['new-price'] / 100);
                        if(error){
                            game.price = "Unavailable";
                        }
                        else if (!error && game.condition == "Used"){
                            game.price = loosePrice;
                        }
                        else if(!error && game.condition == "New"){
                            game.price = newPrice
                        }
                        
                        self.games.push(game);
                    });
                }
                if (callback) callback(rsp);
            },
            error: function (err){
                console.log(err);
            }
        })
    }

    self.getItemsByUser();

}
var viewModel = {};
$(function() {
    viewModel = new itemViewModel();
    ko.applyBindings(viewModel, document.getElementById("mainPage"));
})
