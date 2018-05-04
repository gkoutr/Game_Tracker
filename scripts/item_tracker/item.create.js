
var apiUrl = window.location.origin + "/items/api";
var itemCreateModel = function () {
    var self = this;

    self.game = ko.observable();
    self.gameFields = ko.observableArray();
    self.gameCount = ko.observable(1);
    self.addGame = function (games) {
        var url = apiUrl + "/saveGame"
        $.ajax({
            type: "POST",
            url: url,
            dataType: 'json',
            data: JSON.stringify(ko.toJS(games.gameFields)),
            contentType: 'application/json',
            success: function (rsp) {
                window.location.href = window.location.origin + "/";
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    self.addNewField = function (allFields) {
        var game = {
            title: ko.observable(""),
            console: ko.observable(""),
            condition: ko.observable(""),
            count: ko.observable()
        }
        if (allFields != undefined) {
            self.gameCount(allFields.gameCount() + 1)
            game.count(self.gameCount());
        }
        else {
            game.count(1)
        }
        self.gameFields.push(game);
    }

    self.getDropdown = function () {
        $('.ui.dropdown').dropdown();
    }

    self.getSearchTitle = function () {
        var url = apiUrl + "/search/products/";
        $('.ui.search')
            .search({
                fields: {
                    results: "items",
                    title: "title",
                    description: "console"
                },
                minCharacters: 2,
                apiSettings: {
                    url: url + '{query}'
                },
                onSelect: function(result, response){
                    var text = this;
                    data = ko.dataFor(text);
                    data.title(result.title);
                    data.console(result.console);
                }  
            });            ;
    }
    self.addNewField();

}
var viewModel = {};
$(function () {
    viewModel = new itemCreateModel();
    ko.applyBindings(viewModel, document.getElementById("addPage"));
})
