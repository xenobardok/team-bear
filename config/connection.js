var mysql = require("mysql2"),
  keys = require("./keys"),
  connection = mysql.createConnection(keys);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Database connection has been established");
});

module.exports = connection;
