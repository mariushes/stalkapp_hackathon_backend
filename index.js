const express = require('express');
const app = express();
// const FB = require("FB");
const queryString = require("query-string");
const https = require("https");

// example request
// http.get("<url>", function (http_response) {
//     http_response.on("data", function (data) {
//         // Do something with the data
//         // e.g. res.send(data)
//     })
// });

function base_route(req, res) {
    console.log(req.query.code);
    console.log(req);
    res.send(req.query.code)
}


app.get('/', base_route);

app.get('/germany', function (req, res) {
    res.send('Hallo Leute!')
});


app.get('/api/:user_name', function (req, res) {
    // search for the user name
    // url: https://www.instagram.com/web/search/topsearch/?context=blended&query=<user name
    // get the first user's username
    // build url: https://www.instagram.com/<username>?__a=1
    // get the following data: .graphql.user.edge_owner_to_timeline_media
});

// wikipedia search:
// https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=<search string>
// get pages keys: first_key = Object.keys(.query.pages)[0]
// get the first result: title = data.query.pages[first_key].title
// build the following url: http://wikipedia.com/wiki/<title>

app.listen(3000);
