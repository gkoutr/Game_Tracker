var apiUrl = window.location.origin + "/items/api";
var itemCreateModel = function(){
    var self = this;

    self.game = ko.observable();
    self.gameFields = ko.observableArray();
    self.gameCount = ko.observable(0);
        self.addGame = function(games){
        var url = apiUrl + "/saveGame"
        $.ajax({
            type: "POST",
            url: url,
            dataType: 'json',
            data: JSON.stringify(ko.toJS(games.gameFields)),
            contentType: 'application/json',
            success: function(rsp){
                window.location.href = window.location.origin + "/";
            },
            error: function(err){
                console.log(err);
            }
        })
    }

    self.addNewField = function(){
        var game = {
            title: ko.observable(""),
            console: ko.observable(""),
            condition: ko.observable("")
        };
        self.gameFields.push(game);
        
       
    }

    self.getDropdown = function(){
        $('.ui.dropdown').dropdown();
    }
    self.addNewField();
    
}
var viewModel = {};
$(function() {
    viewModel = new itemCreateModel();
    ko.applyBindings(viewModel,  document.getElementById("addPage"));
})
