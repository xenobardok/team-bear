const 	express = require('express'),
		mysql = require('mysql'),
		keys = require('./config/keys');
const app = express();

const connection = mysql.createConnection(keys);
connection.connect();
const port = 9000;

express.static('static');

app.get('/', function(req, res) {
	res.send("hello from expressjs")
});

app.listen(port, "0.0.0.0");
console.log('listening to port' + port );
