const express = require("express"),
  db = require("./config/connection"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  path = require("path"),
  multer = require("multer");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const rubrics = require("./routes/api/rubrics");
const dashboard = require("./routes/api/dashboard");
const cycle = require("./routes/api/cycle");
const evaluations = require("./routes/api/evaluations");
const reports = require("./routes/api/reports");

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

const port = process.env.PORT || 9000;

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/rubrics", rubrics);
app.use("/api/cycle", cycle);
app.use("/api/dashboard", dashboard);
app.use("/api/evaluations", evaluations);
app.use("/api/reports", reports);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  express.static("static");

  app.get("/", function(req, res) {
    res.send("hello from expressjs");
  });
}

app.listen(port, (req, res) => {
  console.log("listening to port: " + port);
});
