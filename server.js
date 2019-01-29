const express = require('express');
const app = express();
const port = 9000;

express.static('static');

app.get('/', function(req, res) {
	res.send("hello from expressjs")
});

app.listen(port, "0.0.0.0");
console.log('listening to port' + port );
