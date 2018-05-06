var express = require('express');
var app = express();
var request = require('request-promise');
var bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000);

app.post('/messages', (req, res) =>{
    console.log(req.body);
    res.sendStatus(200);
});

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

/*request({
    "method": "GET",
    "uri": "https://api.github.com/",
    "json": true,
    "headers": {
        "User-Agent": "My little demo app"
    }
}).then(console.log);*/

