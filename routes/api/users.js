const express = require("express");
const router = express.Router(),
  db = require("../../config/connection"),
  jwt = require("jsonwebtoken"),
  secret = require("../../config/secret"),
  passport = require("passport");

// Loading Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
validateAddEvaluatorInput = require("../../validation/evaluator");

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
    db.query(sql, (err, result) => {
      if (result.length > 0 && result[0].isActive === "true") {
        errors.email = "User already exists, please login!";
        return res.status(400).json(errors);
      } else if (result.length > 0 && result[0].Fname !== null) {
        errors.email =
          "You have already registered, please verify by logging into your email";
        return res.status(400).json(errors);
      } else if (
        result.length > 0 &&
        result[0].isActive === "false" &&
        result[0].Fname === null
      ) {
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
            return res.status(200).json(result);
          } else if (err) {
            return res.status(404).json(err);
          }
        });
      } else {
        errors.email = "Email not found. Please contact your department head";
        return res.status(400).json(errors);
      }
    });
  }
});

// @route   POST api/users/addEvaluator
// @desc    Register user
// @access  Private
router.post(
  "/addEvaluator",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const dept = db.escape(req.user.dept);
    const type = req.user.type;
    if (type == "Admin") {
      const { errors, isValid } = validateAddEvaluatorInput(req.body);

      //Check for validation
      if (!isValid) {
        return res.status(404).json(errors);
      } else {
        let newEmail = db.escape(req.body.newEmail);

        let isActive = db.escape("false");
        let sql =
          "INSERT INTO Evaluators(Email, Dept_ID, isActive) VALUES(" +
          newEmail +
          "," +
          dept +
          "," +
          isActive +
          ")";
        console.log(sql);
        db.query(sql, (err, result) => {
          if (err) {
            errors.message = "There was some problem adding a new user.";
            return res.status(400).json(errors);
          }
          errors.message = "User successfully added.";
          return res.status(200).json(errors);
        });
      }
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

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
  let password = db.escape(req.body.password);
  sql = "SELECT * from Evaluators where email = " + email;
  db.query(sql, (err, result) => {
    if (result.length < 1) {
      errors.email = "Email not found";
      res.status(404).json(errors);
    } else {
      sql =
        "SELECT * from Evaluators E, Department D where E.email=" +
        email +
        " and E.password = password(" +
        password +
        ") AND E.Dept_ID = D.Dept_ID";
      db.query(sql, (err, result) => {
        if (err) return res.send(err);
        else if (result.length > 0) {
          // User found
          let level = "";
          if (result[0].isActive != "true") {
            errors.email = "Email is not verified. Please verify the email.";
            res.status(404).json(errors);
          } else {
            if (result[0].Email == result[0].Admin_Email) {
              level = "Admin";
            } else {
              level = "Evaluator";
            }
          }

          // res.json({msg: "Successfully logged in"})
          const payload = {
            firstname: result[0].Fname,
            lastname: result[0].Lname,
            email: result[0].Email,
            type: level,
            dept: result[0].Dept_ID
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
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email
    });
  }
);

// @route   GET api/users/members
// @desc    Return list of all the members in that department
// @access  Private
router.get(
  "/members",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profiles = [];
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    if (type == "Admin") {
      let sql =
        "SELECT * FROM Evaluators where isActive='true' AND Dept_ID = " + dept;
      db.query(sql, (err, result) => {
        if (err) res.status(400).json(err);
        else {
          result.forEach(row => {
            let name = row.Fname;
            if (row.Mname != null) {
              name = name + " " + row.Mname;
            }
            name = name + " " + row.Lname;

            let email = row.Email;

            let profile = {
              Name: name,
              Email: email
            };

            profiles.push(profile);
          });

          res.status(200).json(profiles);
        }
      });
    } else {
      res.status(200).json(profiles);
    }
  }
);

module.exports = router;
