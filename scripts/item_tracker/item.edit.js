var apiUrl = window.location.origin + "/api" + window.location.pathname;
var itemEditViewModel = function(data){
    var self = this;
    self.game = ko.observable();

    self.getGameById = function(){
        $.ajax({
            type: "GET",
            url: apiUrl,
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
    self.getGameById();
}
var viewModel = {};
$(function() {
    viewModel = new itemEditViewModel();
    ko.applyBindings(viewModel, document.getElementById("mainPage"));
})