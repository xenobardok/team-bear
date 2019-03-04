const express = require("express"),
  db = require("./config/connection"),
  bodyParser = require("body-parser"),
  passport = require("passport");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const rubrics = require("./routes/api/rubrics");
const dashboard = require("./routes/api/dashboard");

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

const port = 9000;

express.static("static");

app.get("/", function(req, res) {
  res.send("hello from expressjs");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/rubrics", rubrics);
app.use("/api/dashboard", dashboard);

app.listen(port, "0.0.0.0");
console.log("listening to port: " + port);
