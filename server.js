const express = require("express"),
  mysql = require("mysql"),
  db = require("./config/connection"),
  bodyParser = require("body-parser"),
  passport = require("passport");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

const port = 9000;

express.static("static");

app.get("/", function(req, res) {
  res.send("hello from expressjs");
});

app.use("/api/users", users);
app.use("/api/profile", profile);

app.listen(port, "0.0.0.0");
console.log("listening to port: " + port);
