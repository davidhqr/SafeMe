var express = require('express');
var app = express();
var request = require('request-promise');
var bodyParser = require('body-parser');
var APP_ID = "HJcQUexJFd6ee5XJaCQ1";
var APP_CODE = "_q7W4N0oGEkEG5RvgTXM0g";

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000);

app.post('/messages', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
    var origin = getCoords(req.body.Origin);
    var destination = getCoords(req.body.Destionation);
    
});

function getCoords(stringLoc) {
    var url = "https://geocoder.cit.api.here.com/6.2/geocode.json?app_id=" + APP_ID
        + "&app_code=" + APP_CODE + "&searchtext=" + stringLoc;
    request({
        "method": "GET",
        "uri": url,
        "json": true
    }).then((data) => {
        return data.Response.View.Result.Location.DisplayPosition.Latitude + ","
        + data.Response.View.Result.Location.DisplayPosition.Longitude;
    });
}

/*app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err) {
            sendStatus(500);
        }
        io.emit('message', req.body);
        res.sendStatus(200);
    })
});*/

/**/

