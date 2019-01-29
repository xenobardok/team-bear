var express = require('express');
var app = express();
var port = 9000;

app.get('/', function(req, res) {
	res.send("hello from express")
});

app.listen(port, "0.0.0.0");
console.log('listening to port' + port );
