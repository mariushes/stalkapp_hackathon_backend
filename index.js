const express = require('express');
const app = express();
const FB = require("FB");

function base_route(req, res) {
    res.send('Hello World')
}


app.get('/', base_route);

app.get('/germany', function (req, res) {
    res.send('Hallo Leute!')
});


app.get('/facebook', function (req, res) {
    res.send('Hallo Leute!')
});

app.listen(3000);
