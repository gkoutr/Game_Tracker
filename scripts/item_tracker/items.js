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
                    self.games.push(rsp[x]);
                }
                if (callback) callback(rsp);
            },
            error: function (err){
                console.log(err);
            }
        })
    }

    self.getItemsByUser();

    var prices = function(title, system){
        var url = apiUrl + "/search/itemprice/" + title  + ' ' + system;
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (rsp){
                debugger;
            },
            error: function (err){
                console.log(err);
            }
        })
    }
}
var viewModel = {};
$(function() {
    viewModel = new itemViewModel();
    ko.applyBindings(viewModel, document.getElementById("mainPage"));
})
