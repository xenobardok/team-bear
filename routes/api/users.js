const express = require("express");
const router = express.Router(),
  db = require("../../config/connection"),
  jwt = require("jsonwebtoken"),
  secret = require("../../config/secret"),
  passport = require("passport");

// Loading Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works"
  })
);

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check for validation
  if (!isValid) {
    return res.status(404).json(errors);
  } else {
    let email = db.escape(req.body.email);
    let sql = "SELECT * FROM Evaluators WHERE email = " + email;

    db.query(sql, (err, result, fields) => {
      if (result.length > 0 && result[0].isActive === "true") {
        errors.email = "User already exists, please login!";
        return res.status(404).json(errors);
      } else if (result.length > 0 && result[0].Fname !== null) {
        errors.email =
          "You have already registered, please verify by logging into your email";
        return res.status(404).json(errors);
      }
    });

    let firstname = db.escape(req.body.firstname);
    let lastname = db.escape(req.body.lastname);
    let password = db.escape(req.body.password);
    sql =
      "UPDATE Evaluators SET Fname =" +
      firstname +
      ", Lname = " +
      lastname +
      ", Password = PASSWORD(" +
      password +
      ")";
    db.query(sql, function(err, result) {
      if (result) {
        return res.status(200).json(result[0]);
      } else if (err) {
        return res.status(404).json(err);
      }
    });
  }
});

// @route   GET api/users/login
// @desc    Login user
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check for validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  let email = db.escape(req.body.email);

  let sql = "SELECT * FROM Evaluators WHERE email = " + email;
  db.query(sql, function(err, result) {
    if (result.length > 0 && result[0].isActive === "true") {
      errors.email = "User already exists, please login!";
      return res.status(404).json(errors);
    } else if (result.length > 0 && result[0].Fname !== null) {
      errors.email =
        "You have already registered, please verify by logging into your email";
      return res.status(404).json(errors);
    }
  });

  let password = db.escape(req.body.password);
  sql = "SELECT * from users where email = " + email;
  db.query(sql, (err, result) => {
    if (result.length < 1) {
      errors.email = "Email not found";
      res.status(404).json(errors);
    } else {
      sql =
        "SELECT * from users where email=" +
        email +
        " and password = password(" +
        password +
        ")";
      db.query(sql, (err, result) => {
        if (err) return res.send(err);
        else if (result.length > 0) {
          // User found
          // res.json({msg: "Successfully logged in"})
          const payload = {
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: result[0].email
          };
          jwt.sign(
            payload,
            secret.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else if (result.length < 1) {
          errors.password = "Password incorrect";
          res.status(404).json(errors);
        }
      });
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      firstname: req.user[0].firstname,
      lastname: req.user[0].lastname,
      email: req.user[0].email
    });
  }
);

module.exports = router;
