var express = require('express');
var app = express();
var request = require('request-promise');

app.use(express.static(__dirname));
app.listen(3000);

request({
    "method": "GET",
    "uri": "https://api.github.com/",
    "json": true,
    "headers": {
        "User-Agent": "My little demo app"
    }
}).then(console.log, console.log);

