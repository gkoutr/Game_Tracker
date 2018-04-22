var apiUrl = window.location.origin + "/items/api";
var itemCreateModel = function(){
    var self = this;
    self.title = ko.observable("");
    self.console = ko.observable("");
    self.condition = ko.observable("");
    self.game = ko.observable();

    self.addGame = function(game){
        var url = apiUrl + "/saveGame"
        $.ajax({
            type: "POST",
            url: url,
            dataType: 'json',
            data: JSON.stringify(ko.toJS(game)),
            contentType: 'application/json',
            success: function(rsp){
                window.location.href = window.location.origin + "/";
            },
            error: function(err){
                console.log(err);
            }
        })
    }
}

var viewModel = {};
$(function() {
    viewModel = new itemCreateModel();
    ko.applyBindings(viewModel,  document.getElementById("addPage"));
})
