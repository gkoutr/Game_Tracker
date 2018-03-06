var apiUrl = window.location.origin + "/api";
var itemEditViewModel = function(data){
    var self = this;
    self.game = ko.observable();

    self.getGameById = function(){
        var url = apiUrl + window.location.pathname
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (rsp){
                if (rsp != null) {
                    self.game(rsp);
                    debugger;
                    $(".ui.dropdown").dropdown("set selected", rsp.condition);
                }
                
            },
            error: function (err){
                console.log(err);
            }
        })
    }
            
    self.updateGame = function(game, callback){
        var url = apiUrl + "/items/" + game.id;
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(game),
            success: function(rsp){
                window.location.href = window.location.origin + "/";
            },
            error: function(err){
                $('.tiny.modal')
                    .modal('show')
                    ;
            }
        })
    }
    self.getGameById();
}
var viewModel = {};
$(function() {
    viewModel = new itemEditViewModel();
    ko.applyBindings(viewModel, document.getElementById("mainPage"));
})