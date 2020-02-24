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

function wikipedia(searchString){
    url = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=" + searchString;
    https.get(url, function (http_response) {
    http_response.on("data", function (data) {
        data = JSON.parse(data);
        //console.log(data);

        first_key = Object.keys(data.query.pages)[0];
        title = data.query.pages[first_key].title;
        final_url="http://wikipedia.com/wiki/"+title;
        // e.g. res.send(data)
        process.stdout.write(final_url);
    })
});
}

function image_recognition(image_url){
    to_be_sent={ "requests":[
        {
            "image":{
                "source":{
                    "imageUri":
                        image_url
                }
            },
            "features":[
                {
                    "type":"OBJECT_LOCALIZATION",
                    "maxResults":1
                }
            ]
        }
    ]}

    var postData = JSON.stringify(to_be_sent);

    var options = {
        hostname: 'vision.googleapis.com',
        port: 443,
        path: '/v1/images:annotate?key=AIzaSyBp3kyqBb42aE9Ca-70d6jPPd7QybEBzWE',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    var req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();
}

image_recognition("https://assets.biggreenegg.eu/app/uploads/2018/06/28115815/topimage-pizza-special17-800x500.jpg")

//wikipedia("ciorba");

//app.listen(3000);
