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

app.post('/api/photo', function (req, res) {
    result = {};
    wikipedia_promise = wikipedia("sarma");
    wikipedia_promise.then(function (data) {
        result["wikipedia"] = data;
        wikipedia("sarma").then(function (data) {
            result["data"] = data;
            res.send(JSON.stringify(result));
        })
    });
});


app.get('/api/:user_name', function (req, res) {
    // search for the user name
    // url: https://www.instagram.com/web/search/topsearch/?context=blended&query=<user name
    // get the first user's username
    // build url: https://www.instagram.com/<username>?__a=1
    // get the following data: .graphql.user.edge_owner_to_timeline_media
});


function wikipedia(searchString) {
    return new Promise((resolve, reject) => {
        url = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=" + searchString;
        https.get(url, function (http_response) {
            http_response.on("data", function (data) {
                data = JSON.parse(data);

                first_key = Object.keys(data.query.pages)[0];
                title = data.query.pages[first_key].title;
                final_url = "http://wikipedia.com/wiki/" + title;
                resolve(final_url)
            })
        });
    });
}
app.listen(3000);
