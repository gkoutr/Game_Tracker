ko.bindingHandlers.typeaheadTest = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        debugger;
        var allBindings = allBindingsAccessor();
        var fieldId = ko.utils.unwrapObservable(valueAccessor());
        // var customDataSetId = allBindings.customDataSetId;
        debugger;
        var url = window.location.origin +  "/items/api/search/products/" + "pokemon";
        var filterBH = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: url
            }
        });
        filterBH.initialize();
        $('#title').typeahead({
            highlight: true,
            hint: true
        }, {
                name: 'filterBH',
                displayKey: 'Key',
                source: filterBH});
    }
};

// ko.bindingHandlers.typeahead = {
//     init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//       var $element = $(element);
//       var allBindings = allBindingsAccessor();
//       //var value = ko.utils.unwrapObservable(allBindings.value);
//       var source = ko.utils.unwrapObservable(valueAccessor());
//       var items = ko.utils.unwrapObservable(allBindings.items) || 4;
          
//       var valueChange =  function(item){
//           //console.log('item = ' + item);
//           return item;
//       };
      
//       var highlighter = function(item){
//         var matchSpan = '<span style="color: blue;font-weight:bold">';
//         var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
//         return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
//           return matchSpan + match + '</span>';
//         });
//       };
          
//       var options = {
//           source : source,
//           items: items,
//           updater: valueChange
//       };
  
//       $element
//           .attr('autocomplete', 'off')
//           .typeahead(options);
//       }
//   };
  
  
//   var vm = (function () {
//       var Person = function (first, last) {
//           this.firstName = ko.observable(first);
//           this.lastName = ko.observable(last);
//           this.movie = ko.observable();
          
//           this.movie.subscribe(function(val){
//             console.log(val);
//             val && toastr.info(val);
//           })
          
//       };
//       var movie = ko.observable();
//       var data = ['Iron Man', 'Iron Man 2', 'Iron Man 3', 'Avengers', 
//         'LOTR: The Fellowship of the Ring',
//         'LOTR: The Two Towers',
//         'LOTR: The Return of the Ring',
//         'Star Wars I: Phantom Menace',
//         'Star Wars II: Attack of the Clones',
//         'Star Wars III: Revenge of the Sith',
//         'Star Wars IV: A New Hope',
//         'Star Wars V: The Empire Strikes Back',
//         'Star Wars VI: Return of the Jedi',
//         'The Princess Bride',
//         'Thor',
//         'Captain America'
//         ];
//       var movies = ko.observableArray(data);
  
//       var p1 = new Person('John', 'Papa');
//       var p2 = new Person('Colleen', 'Papa');
//       var p3 = new Person('Ella', 'Papa');
      
//       var people = ko.observableArray([p1, p2, p3]);
  
//       var vm = {
//           movies: movies,
//           movie:movie,
//           moviesJSON: ko.toJSON(movies, null, 0)
//       };
      
//       return vm;
//   })();
  
//   ko.applyBindings(vm);
  