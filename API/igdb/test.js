var igdb = require('igdb-api-node').default;
var client = igdb('0d0a1c9e8d9fa2c618b5612f1f5a27d7');
const https = require("https");


const url = "https://api-2445582011268.apicast.io/platforms/?fields=name";

// function platforms(req, res){
//     debugger;
//     client.platforms({
//         fields: 'name',
//         limit: 20,
//         offset: 15
//       }).then(response => {
//         res.send(response.body)
//       }).catch(error => {
//         throw error;
//       });
// }
