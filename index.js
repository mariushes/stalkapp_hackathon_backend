const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
app.use(bodyParser.json({extended: true}));


app.options('*', cors());

app.post('/api/photo', cors(), function (req, res) {
    try {
        result = {};
        image_recognition(req.body.photo_url).then(function (data) {
            object_in_image = data.responses[0].labelAnnotations[0].description;
            wikipedia(object_in_image).then(function (data) {
                result["wikipedia"] = data;
                res.send(JSON.stringify(result));
            })
        });
    } catch (e) {
        res.status(500);
        res.send(e);
    }
});


app.get('/api/search/:user_name', cors(), function (req, res) {
    try {
        search_instagram(req.params.user_name).then(function (profile_url) {
            get_instagram_pictures(profile_url).then(function (instagram_data) {
                res.send(JSON.stringify({"result": instagram_data}));
            })
        });
    } catch (e) {
        res.status(500);
        res.send(e);
    }
});

function get_instagram_pictures(profile_url) {
    return new Promise((resolve, reject) => {
        https.get(profile_url, function (http_response) {
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
        https.get(userid_url, function (http_response) {
            var body = "";
            http_response.on("data", function (data) {
                body = body + data;
            });
            http_response.on("end", function (data) {

                const username_response = JSON.parse(body);
                if (username_response.users.length > 0) {
                    userid = username_response.users[0].user.username;
                    profile_url = 'https://www.instagram.com/' + userid + '/?__a=1';
                    resolve(profile_url);
                } else {
                    resolve("")
                }
            })
        })
    });
}

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
