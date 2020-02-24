const express = require('express');
const app = express();
// const FB = require("FB");
const queryString = require("query-string");
const http = require("https");

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
    search_instagram(req.params.user_name).then(function (profile_url) {
        get_instagram_pictures(profile_url).then(function (instagram_data) {
            res.send(JSON.stringify({"result": instagram_data}));
        })
    });
});


function get_instagram_pictures(profile_url) {
    return new Promise((resolve, reject) => {
        http.get(profile_url, function (http_response) {
            var body = "";
            http_response.on("data", function (data) {
                body = body + data;
            });
            http_response.on("end", function (data) {
                const profile_response = JSON.parse(body);
                result = [];
                edges = profile_response.graphql.user.edge_owner_to_timeline_media.edges;
                for (i = 0; i <= (5 <= edges.length ? 5 : edges.length); i++) {
                    result.push(edges[i].node.display_url);
                }

                resolve(result);
            })
        })
    });
}

function search_instagram(username) {
    return new Promise((resolve, reject) => {
        var userid_url = "https://www.instagram.com/web/search/topsearch/?context=blended&query=" + username;
        http.get(userid_url, function (http_response) {
            var body = "";
            http_response.on("data", function (data) {
                body = body + data;
            });
            http_response.on("end", function (data) {

                const username_response = JSON.parse(body);
                userid = username_response.users[0].user.username;
                profile_url = 'https://www.instagram.com/' + userid + '/?__a=1';
                resolve(profile_url);
            })
        })
    });
}

// search for the user name
// url: https://www.instagram.com/web/search/topsearch/?context=blended&query=<user name
// get the first user's username
// build url: https://www.instagram.com/<username>?__a=1
// get the following data: .graphql.user.edge_owner_to_timeline_media


// wikipedia search:
// https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=<search string>
// get pages keys: first_key = Object.keys(.query.pages)[0]
// get the first result: title = data.query.pages[first_key].title
// build the following url: http://wikipedia.com/wiki/<title>

app.listen(3000);
