const express = require('express');
const app = express();
const https = require("https");
const bodyParser = require('body-parser');

app.use(bodyParser.json({ extended: true }));

app.post('/api/photo', function (req, res) {
    result = {};
    image_recognition(req.body.photo_url).then(function (data) {
        console.log(data.responses[0]);
        object_in_image = data.responses[0].labelAnnotations[0].description;
        wikipedia(object_in_image).then(function (data) {
            result["wikipedia"] = data;
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


function image_recognition(image_url) {
    return new Promise((resolve, reject) => {
        to_be_sent = {
            "requests": [
                {
                    "image": {
                        "source": {
                            "imageUri":
                            image_url
                        }
                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION",
                            "maxResults": 1
                        }
                    ]
                }
            ]
        };

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
            buffer = "";
            res.on('data', (data) => {
                buffer = buffer + data;
            });

            res.on('end', (data) => {
                resolve(JSON.parse(buffer));
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });

        req.write(postData);
        req.end();
    });
}

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
