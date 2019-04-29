const express = require("express");
const router = express.Router(),
  db = require("../../config/connection"),
  jwt = require("jsonwebtoken"),
  secret = require("../../config/secret"),
  passport = require("passport"),
  nodemailer = require("nodemailer");

// Loading Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
validateAddEvaluatorInput = require("../../validation/evaluator");
const isEmpty = require("../../validation/isEmpty");

const validator = require("validator");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works"
  })
);

const tempCodeGenerator = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check for validation
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    let email = db.escape(req.body.email);
    let sql = "SELECT * FROM Evaluators WHERE email = " + email;

    db.query(sql, (err, result) => {
      if (result.length > 0 && result[0].isActive === "true") {
        errors.email = "User already exists, please login!";

        return res.status(400).json(errors);
      } else if (
        result.length > 0 &&
        result[0].isActive === "false" &&
        result[0].isDeleted === "false" &&
        result[0].password == null
      ) {
        let firstname = db.escape(req.body.firstname);
        let lastname = db.escape(req.body.lastname);
        let password = db.escape(req.body.password);
        let Temp_Code = req.body.tempCode;

        if (result[0].Temp_Code == Temp_Code) {
          sql =
            "UPDATE Evaluators SET Temp_Code=null, Fname =" +
            firstname +
            ", Lname = " +
            lastname +
            ", Password = PASSWORD(" +
            password +
            "), " +
            "isActive = " +
            db.escape("true") +
            " WHERE Email = " +
            email;

          db.query(sql, function(err, result) {
            if (result) {
              return res
                .status(200)
                .json({ message: "User successfully registered!" });
            } else if (err) {
              return res.status(404).json(err);
            }
          });
        } else {
          errors.tempCode =
            "Temp Code does not match. Please contact Program Administrator";
          return res.status(400).json(errors);
        }
      } else {
        errors.email = "Email not found. Please contact your department head";
        return res.status(400).json(errors);
      }
    });
  }
});

// @route   GET api/users/cancelInvite
// @desc    Remove Invited user
// @access  Public
router.delete(
  "/cancelInvite",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Check for validation
    const dept = db.escape(req.user.dept);
    const type = req.user.type;
    let email = db.escape(req.user.email);
    let removeEmail = db.escape(req.body.removeEmail);
    errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT * FROM Evaluators WHERE email = " +
        removeEmail +
        " AND Dept_ID=" +
        dept;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (result.length > 0 && result[0].isActive === "true") {
          errors.email = "User already registered, please delete the user!";
          return res.status(400).json(errors);
        } else if (result.length > 0 && result[0].isActive == "false") {
          sql = "SELECT * FROM PROGRAM_ADMIN where Admin_Email=" + removeEmail;

          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            if (result.length > 0) {
              errors.email =
                "User is also an admin of the department. Please remove as Program Administrator first.";
              return res.status(400).json(errors);
            } else {
              sql = "DELETE FROM Evaluators WHERE Email=" + removeEmail;
              db.query(sql, (err, result) => {
                // console.log(sql);
                if (err) return res.status(400).json(err);

                return res.status(200).json({ Email: req.body.removeEmail });
              });
            }
          });
        } else {
          errors.email = "User not found";
          return res.status(400).json(errors);
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   DELETE api/users/removeEvaluator
// @desc    Remove Invited user
// @access  Public
router.delete(
  "/removeEvaluator",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Check for validation
    const dept = db.escape(req.user.dept);
    const type = req.user.type;
    let email = db.escape(req.user.email);
    let removeEmail = db.escape(req.body.removeEmail);

    errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT * FROM Evaluators WHERE email = " +
        removeEmail +
        " AND Dept_ID=" +
        dept;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (result.length > 0) {
          sql = "SELECT * FROM PROGRAM_ADMIN where Admin_Email=" + removeEmail;

          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            if (result.length > 0) {
              errors.email =
                "User is also an admin of the department. Please remove as Program Administrator first.";
              return res.status(400).json(errors);
            } else {
              sql =
                "SELECT *  FROM RUBRIC_MEASURE_EVALUATOR WHERE Evaluator_Email=" +
                removeEmail;

              db.query(sql, (err, result) => {
                if (err) return res.status(400).json(err);
                if (result.length > 0) {
                  sql =
                    "UPDATE Evaluators SET isDeleted='true',isActive='false' WHERE Email=" +
                    removeEmail;

                  db.query(sql, (err, result) => {
                    if (err) return res.status(400).json(err);

                    return res
                      .status(200)
                      .json({ Email: req.body.removeEmail });
                  });
                } else {
                  sql =
                    "SELECT *  FROM TEST_MEASURE_EVALUATOR WHERE Evaluator_Email=" +
                    removeEmail;

                  db.query(sql, (err, result) => {
                    if (err) return res.status(400).json(err);
                    if (result.length > 0) {
                      sql =
                        "UPDATE Evaluators SET isDeleted='true', isActive='false', Password=Null WHERE Email=" +
                        removeEmail;

                      db.query(sql, (err, result) => {
                        if (err) return res.status(400).json(err);

                        return res
                          .status(200)
                          .json({ Email: req.body.removeEmail });
                      });
                    } else {
                      sql = "DELETE FROM Evaluators WHERE Email=" + removeEmail;

                      db.query(sql, (err, result) => {
                        if (err) return res.status(400).json(err);

                        return res
                          .status(200)
                          .json({ Email: req.body.removeEmail });
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          errors.email = "User not found";
          return res.status(400).json(errors);
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

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
        let Temp_Code = tempCodeGenerator(6);

        sql = "SELECT * FROM Evaluators where Email=" + newEmail;

        db.query(sql, (err, result) => {
          if (err) {
            return res.status(400).json({ error: "Something went wrong" });
          } else {
            if (result.length > 0) {
              if (result[0].isDeleted == "false") {
                errors.message = "Evaluator is active. Please delete first";
                return res.status(400).json(errors);
              } else {
                sql =
                  "UPDATE Evaluators set isDeleted='false', Password=Null, Dept_ID=" +
                  dept +
                  ", isActive=" +
                  isActive +
                  ", Temp_Code=" +
                  db.escape(Temp_Code) +
                  " WHERE Email=" +
                  newEmail;
                console.log(sql);
                db.query(sql, (err, result) => {
                  if (err) {
                    errors.message =
                      "There was some problem adding a new user.";
                    return res.status(400).json(errors);
                  }
                  user = {
                    Email: req.body.newEmail,
                    isActive: "false"
                  };

                  var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "ulmevaluations@gmail.com",
                      pass: "thebestulm"
                    }
                  });

                  const mailOptions = {
                    from: "ulmevaluations@gmail.com", // sender address
                    to: req.body.newEmail, // list of receivers
                    subject: "Welcome to ULM Evaluations ", // Subject line
                    html:
                      `<div><p>Welcome to ULM Evaluations</p>
              <p>You have been invited to join ULM Evaluations. Please click <a href="https://team-bear.herokuapp.com/register">here</a> to register and access your account today!</P><br><B>Please enter the following Temp Code during registration. <br>Temp Code: ` +
                      Temp_Code +
                      `
            </div>` // plain text body
                  };
                  transporter.sendMail(mailOptions, function(err, info) {
                    if (err) console.log(err);
                    else console.log("Email sent!");
                  });
                  return res.status(200).json(user);
                });
              }
            } else {
              sql =
                "INSERT INTO Evaluators(Email, Dept_ID, isActive, Temp_Code) VALUES(" +
                newEmail +
                "," +
                dept +
                "," +
                isActive +
                "," +
                db.escape(Temp_Code) +
                ")";
              console.log(sql);
              db.query(sql, (err, result) => {
                if (err) {
                  errors.message = "There was some problem adding a new user.";
                  return res.status(400).json(errors);
                }
                user = {
                  Email: req.body.newEmail,
                  isActive: "false"
                };

                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "ulmevaluations@gmail.com",
                    pass: "thebestulm"
                  }
                });

                const mailOptions = {
                  from: "ulmevaluations@gmail.com", // sender address
                  to: req.body.newEmail, // list of receivers
                  subject: "Welcome to ULM Evaluations ", // Subject line
                  html:
                    `<div><p>Welcome to ULM Evaluations</p>
                  <p>You have been invited to join ULM Evaluations. Please click <a href="https://team-bear.herokuapp.com/register">here</a> to register and access your account today!</P><br><B>Please enter the following Temp Code during registration. <br>Temp Code: ` +
                    Temp_Code +
                    `
                </div>` // plain text body
                };
                transporter.sendMail(mailOptions, function(err, info) {
                  if (err) console.log(err);
                  else console.log("Email sent!");
                });
                return res.status(200).json(user);
              });
            }
          }
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
  sql = "SELECT * from Evaluators where isDeleted='false' AND email = " + email;
  db.query(sql, (err, result) => {
    if (result.length < 1) {
      errors.email = "Email not found";
      res.status(404).json(errors);
    } else {
      sql =
        "SELECT * from Evaluators E, Department D  where E.email=" +
        email +
        " and E.password = password(" +
        password +
        ") AND E.Dept_ID = D.Dept_ID";
      db.query(sql, (err, result) => {
        // console.log(sql);
        if (err) return res.send(err);
        else if (result.length > 0) {
          // User found
          let level = "";
          if (result[0].isActive != "true") {
            errors.email = "Email is not verified. Please verify the email.";
            res.status(404).json(errors);
          } else {
            //User exists
            const payload = {
              firstname: result[0].Fname,
              lastname: result[0].Lname,
              email: result[0].Email,
              type: "",
              dept: result[0].Dept_ID,
              isSuperUser: result[0].isSuperUser
            };

            sql =
              "SELECT  *  FROM PROGRAM_ADMIN WHERE Dept_ID=" +
              db.escape(payload.dept) +
              " AND Admin_Email=" +
              email;

            db.query(sql, (err, result) => {
              if (err) return res.send(err);
              if (result.length > 0) {
                payload.type = "Admin";
              } else {
                payload.type = "Evaluator";
              }

              // res.json({msg: "Successfully logged in"})

              // console.log(payload);
              jwt.sign(
                payload,
                secret.secretOrKey,
                { expiresIn: 86400 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                }
              );
            });
          }
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

// @route   GET api/users/evaluators
// @desc    Return list of all the evaluators in that department
// @access  Private
router.get(
  "/evaluators",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profiles = [];
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    if (type == "Admin") {
      let sql =
        "SELECT * FROM Evaluators where Dept_ID = " +
        dept +
        " AND isDeleted='false' ORDER BY Fname ASC";
      db.query(sql, (err, result) => {
        if (err) res.status(400).json(err);
        else {
          result.forEach(row => {
            let name = row.Fname;
            if (row.Fname == null) {
              name = "";
            }
            if (row.Mname != null) {
              name = name + " " + row.Mname;
            }

            if (row.Lname == null) {
              name += "";
            } else {
              name = name + " " + row.Lname;
            }

            let email = row.Email;
            let isActive = row.isActive;
            let profile = {
              Name: name,
              Email: email,
              isActive: isActive
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

// @route   Delete api/users/changeName
// @desc   Change your own name
// @access  Private
router.put(
  "/changeName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Fname = db.escape(req.body.Fname);
    let Mname = db.escape(req.body.Mname);
    let Lname = db.escape(req.body.Lname);

    if (req.body.Mname == "") {
      Mname = null;
    }

    let errors = {};

    if (isEmpty(req.body.Fname) || isEmpty(req.body.Lname)) {
      errors.Name = "First Name or Last Name cannot be empty";
      return res.status(400).json(errors);
    } else {
      sql =
        "UPDATE Evaluators SET Fname=" +
        Fname +
        ", Mname=" +
        Mname +
        ",Lname=" +
        Lname +
        " WHERE Email=" +
        db.escape(email);

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          res
            .status(200)
            .json({ firstname: req.body.Fname, lastname: req.body.Lname });
        }
      });
    }
  }
);

// @route   Delete api/users/changePassword
// @desc   Change your own name
// @access  Private
router.put(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Password = db.escape(req.body.Password);
    let errors = {};

    if (!validator.isLength(req.body.Password, { min: 6, max: 20 })) {
      errors.Password = "Password must be 6-20 characters long";
      return res.status(400).json(errors);
    } else {
      sql =
        "UPDATE Evaluators SET Password=PASSWORD(" +
        Password +
        ") WHERE  Email=" +
        db.escape(email);

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          res.status(200).json({ Email: "Password successfully updated" });
        }
      });
    }
  }
);

module.exports = router;
