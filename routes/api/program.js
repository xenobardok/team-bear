const express = require("express");
const router = express.Router(),
  db = require("../../config/connection"),
  jwt = require("jsonwebtoken"),
  secret = require("../../config/secret"),
  passport = require("passport"),
  nodemailer = require("nodemailer");

const isEmpty = require("../../validation/isEmpty");

// Loading Input Validation
const validator = require("validator");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
validateAddEvaluatorInput = require("../../validation/evaluator");

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

// @route   GET api/department
// @desc    Gets the lists of all departments
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let departmentList = [];

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department";
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              result.forEach(row => {
                department = {
                  Department_ID: row.Department_ID,
                  Dept_Name: row.Department_Name,
                  Dept_ID: row.Dept_ID
                };
                departmentList.push(department);
              });

              return res.status(200).json(departmentList);
            }
          });
        }
      }
    });
  }
);

// @route   POST api/department/create
// @desc    Create a new department
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let New_Dept_ID = req.body.deptID;
    let New_Dept_Name = req.body.deptName;

    let departmentList = [];
    if (isEmpty(New_Dept_ID)) {
      return res.status(400).json({ Dept_ID: "Department ID cannot be empty" });
    }
    if (isEmpty(New_Dept_Name)) {
      return res
        .status(400)
        .json({ Dept_Name: "Department Name cannot be empty" });
    }

    New_Dept_ID = db.escape(New_Dept_ID);
    New_Dept_Name = db.escape(New_Dept_Name);
    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department WHERE Dept_ID=" + New_Dept_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length > 0) {
                return res
                  .status(400)
                  .json({ Dept_ID: "Department with that ID already exits" });
              } else {
                sql =
                  "INSERT INTO Department (Dept_ID, Department_Name) VALUES(" +
                  New_Dept_ID +
                  "," +
                  New_Dept_Name +
                  ")";

                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    newDept = {
                      Department_ID: result.insertID,
                      Dept_ID: New_Dept_ID,
                      Dept_Name: New_Dept_Name
                    };
                    res.status(200).json(newDept);
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

// @route   PUT api/department/:DepartmentID/update/name
// @desc    Updates the  department name
// @access  Private
router.put(
  "/:DepartmentID/update/name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Department_ID = db.escape(req.params.DepartmentID);
    New_Dept_Name = req.body.deptName;
    if (isEmpty(New_Dept_Name)) {
      return res
        .status(400)
        .json({ Dept_Name: "Department Name cannot be empty" });
    }
    New_Dept_Name = db.escape(New_Dept_Name);
    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department WHERE Department_ID=" + Department_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res.status(400).json({ Dept_ID: "DepartmentNot found" });
              } else {
                sql =
                  "UPDATE Department Set Department_Name=" +
                  New_Dept_Name +
                  " WHERE Department_ID=" +
                  Department_ID;

                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    newDept = {
                      Department_ID: Department_ID,
                      Dept_ID: Dept_ID,
                      Dept_Name: New_Dept_Name
                    };
                    res.status(200).json(newDept);
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

// @route   PUT api/department/:DepartmentID/update/id
// @desc    Updates the  department id
// @access  Private
router.put(
  "/:DepartmentID/update/id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Department_ID = req.params.DepartmentID;
    let New_Dept_ID = req.body.deptID;

    if (isEmpty(New_Dept_ID)) {
      return res.status(400).json({ Dept_ID: "Department ID cannot be empty" });
    }
    New_Dept_ID = db.escape(req.body.deptID);
    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department WHERE Department_ID=" + Department_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res
                  .status(400)
                  .json({ Dept_ID: "Department Not found" });
              } else {
                sql = "SELECT * FROM Department WHERE Dept_ID=" + New_Dept_ID;
                db.query(sql, (err, result) => {
                  console.log(sql);
                  if (err) return res.status(400).json(err);
                  else {
                    if (result.length > 0) {
                      return res
                        .status(400)
                        .json({ Dept_ID: "Department ID already exists" });
                    } else {
                      sql =
                        "UPDATE Department Set  Dept_ID=" +
                        New_Dept_ID +
                        " WHERE Department_ID=" +
                        Department_ID;
                      db.query(sql, (err, result) => {
                        if (err) return res.status(400).json(err);
                        else {
                          sql =
                            "SELECT * FROM Department WHERE Department_ID=" +
                            Department_ID;

                          db.query(sql, (err, result) => {
                            if (err) return res.status(400).json(err);
                            else {
                              newDept = {
                                Department_ID: result[0].Department_ID,

                                Dept_ID: result[0].Dept_ID,
                                Dept_Name: result[0].Department_Name
                              };
                              res.status(200).json(newDept);
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

// @route   DELETE api/department/:Department_ID/
// @desc    Updates the  department id
// @access  Private
router.delete(
  "/:Department_ID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    const Department_ID = db.escape(req.params.Department_ID);

    let departmentList = [];

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUser= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department WHERE Department_ID=" + Department_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res
                  .status(400)
                  .json({ Dept_ID: "Department Not found" });
              } else {
                Dept_ID = db.escape(result[0].Dept_ID);
                sql = "SELECT * FROM ASSESSMENT_CYCLE WHERE Dept_ID=" + Dept_ID;
                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    if (result.length > 0) {
                      return res.status(400).json({
                        Dept_ID:
                          "There are Assessment Cycles associated with this department. Please delete them first."
                      });
                    } else {
                      sql = "SELECT * FROM RUBRIC WHERE Dept_ID=" + Dept_ID;
                      db.query(sql, (err, result) => {
                        if (err) return res.status(400).json(err);

                        if (result.length > 0) {
                          return res.status(400).json({
                            Dept_ID:
                              "There are Rubric associated with this department. Please delete them first."
                          });
                        } else {
                          sql =
                            "SELECT * FROM Evaluators WHERE Dept_ID=" + Dept_ID;

                          db.query(sql, (err, result) => {
                            if (err) return res.status(400).json(err);

                            if (result.length > 0) {
                              return res.status(400).json({
                                Dept_ID:
                                  "There are Evaluators and Program Administrators associated with this department. Please delete them first."
                              });
                            } else {
                              sql =
                                "DELETE  FROM PROGRAM_ADMIN WHERE Dept_ID=" +
                                Dept_ID;
                              db.query(sql, (err, result) => {
                                if (err) return res.status(400).json(err);
                                else {
                                  sql =
                                    "DELETE  FROM Department WHERE Department_ID=" +
                                    Department_ID;
                                  db.query(sql, (err, result) => {
                                    if (err) return res.status(400).json(err);
                                    else {
                                      return res
                                        .status(200)
                                        .json({ msg: "Successfully deleted" });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

// @route   GET api/department/:Department_ID/
// @desc    Returns the department details
// @access  Private
router.get(
  "/:Department_ID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    const Department_ID = db.escape(req.params.Department_ID);

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department WHERE Department_ID=" + Department_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res
                  .status(400)
                  .json({ Department_ID: "Department Not found" });
              } else {
                let Dept_ID = db.escape(result[0].Dept_ID);
                department = {
                  Department_ID: result[0].Department_ID,
                  Dept_ID: result[0].Dept_ID,
                  Dept_Name: result[0].Department_Name,
                  admin: []
                };

                sql =
                  "SELECT * FROM Evaluators E, PROGRAM_ADMIN A WHERE E.Email=A.Admin_Email AND E.Dept_ID= A.Dept_ID AND A.Dept_ID=" +
                  Dept_ID;
                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    result.forEach(row => {
                      Fname = row.Fname;
                      Lname = row.Lname;
                      if (Fname == null) {
                        Fname = "";
                      }
                      if (Lname == null) {
                        Lname = "";
                      }
                      Admin = {
                        Admin_Name: Fname + " " + Lname,
                        Admin_Email: row.Admin_Email
                      };
                      department.admin.push(Admin);
                    });

                    return res.status(200).json(department);
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

// @route   POST api/department/:Department_ID/addAdmin
// @desc    Adds an Admin to a department
// @access  Private
router.post(
  "/:Department_ID/addAdmin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Department_ID = db.escape(req.params.Department_ID);
    let New_Admin_Email = db.escape(req.body.adminEmail);

    if (!validator.isEmail(req.body.adminEmail)) {
      res.status(400).json({
        email: "Email is not valid"
      });
    } else {
      let sql =
        "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
        db.escape(email);

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          if (result.length < 1) {
            return res
              .status(400)
              .json({ User: "You do not have enough privileges" });
          } else {
            sql =
              "SELECT * FROM Department WHERE Department_ID=" + Department_ID;
            //   console.log(sql);
            db.query(sql, (err, result) => {
              if (err) return res.status(400).json(err);
              else {
                if (result.length < 1) {
                  return res
                    .status(400)
                    .json({ email: "Department Not found" });
                } else {
                  let Dept_ID = db.escape(result[0].Dept_ID);
                  sql =
                    "SELECT * FROM Evaluators WHERE Dept_ID=" +
                    Dept_ID +
                    " AND Email =" +
                    New_Admin_Email;
                  db.query(sql, (err, result) => {
                    if (err) return res.status(400).json(err);
                    else {
                      //User Already exists, check if admin or not, if not just make them Admin for that dept
                      if (result.length > 0) {
                        sql =
                          "SELECT *  FROM PROGRAM_ADMIN  WHERE Admin_Email=" +
                          New_Admin_Email +
                          " AND Dept_ID=" +
                          Dept_ID;

                        db.query(sql, (err, result) => {
                          if (err) return res.status(400).json(err);
                          else {
                            if (result.length > 0) {
                              return res
                                .status(400)
                                .json({ email: "User is already the admin" });
                            }

                            sql =
                              "INSERT INTO PROGRAM_ADMIN(Admin_Email, Dept_ID) VALUES(" +
                              New_Admin_Email +
                              "," +
                              Dept_ID +
                              ")";
                            db.query(sql, (err, result) => {
                              if (err) return res.status(400).json(err);
                              else {
                                sql =
                                  "SELECT * FROM Evaluators E, PROGRAM_ADMIN A WHERE E.Email=A.Admin_Email AND E.Dept_ID= A.Dept_ID AND A.Dept_ID=" +
                                  Dept_ID;
                                db.query(sql, (err, result) => {
                                  if (err) return res.status(400).json(err);
                                  else {
                                    department = {
                                      Dept_ID: result[0].Dept_ID,
                                      admin: []
                                    };
                                    result.forEach(row => {
                                      Fname = row.Fname;
                                      Lname = row.Lname;
                                      if (Fname == null) {
                                        Fname = "";
                                      }
                                      if (Lname == null) {
                                        Lname = "";
                                      }
                                      Admin = {
                                        Admin_Name: Fname + " " + Lname,
                                        Admin_Email: row.Admin_Email
                                      };
                                      department.admin.push(Admin);
                                    });

                                    var transporter = nodemailer.createTransport(
                                      {
                                        service: "gmail",
                                        auth: {
                                          user: "ulmevaluations@gmail.com",
                                          pass: "thebestulm"
                                        }
                                      }
                                    );

                                    const mailOptions = {
                                      from: "ulmevaluations@gmail.com", // sender address
                                      to: req.body.adminEmail, // list of receivers
                                      subject: "Welcome to ULM Evaluations ", // Subject line
                                      html:
                                        `<div><p>Welcome to ULM Evaluations</p>
                                <p>You have been promoted as the <B>Program Coordinator</B> of the department  ` +
                                        dept +
                                        `Please click <a href="https://team-bear.herokuapp.com/">here</a> to access your account today!
                              </div>` // plain text body
                                    };
                                    transporter.sendMail(mailOptions, function(
                                      err,
                                      info
                                    ) {
                                      if (err) console.log(err);
                                      else console.log("Email sent!");
                                    });
                                    return res.status(200).json(department);
                                  }
                                });
                              }
                            });
                          }
                        });
                      } else {
                        //User does not exist in that department
                        sql =
                          "SELECT *  FROM Evaluators WHERE Email=" +
                          New_Admin_Email;

                        db.query(sql, (err, result) => {
                          if (err) return res.status(400).json(err);
                          else {
                            //if user belongs to another department
                            if (result.length > 0) {
                              return res.status(400).json({
                                email:
                                  "Evaluator with that email exists in another department"
                              });
                            }
                            //User with that  email  does not  exist at all
                            else {
                              let Temp_Code = tempCodeGenerator(6);
                              sql =
                                "INSERT INTO Evaluators(Email, Dept_ID,Temp_Code, isActive) VALUES(" +
                                New_Admin_Email +
                                "," +
                                Dept_ID +
                                "," +
                                db.escape(Temp_Code) +
                                ",'false')";

                              db.query(sql, (err, result) => {
                                if (err) return res.status(400).json(err);
                                else {
                                  sql =
                                    "INSERT INTO PROGRAM_ADMIN(Admin_Email, Dept_ID) VALUES(" +
                                    New_Admin_Email +
                                    "," +
                                    Dept_ID +
                                    ")";

                                  db.query(sql, (err, result) => {
                                    if (err) return res.status(400).json(err);
                                    else {
                                      sql =
                                        "SELECT * FROM Evaluators E, PROGRAM_ADMIN A WHERE E.Email=A.Admin_Email AND E.Dept_ID= A.Dept_ID AND A.Dept_ID=" +
                                        Dept_ID;
                                      db.query(sql, (err, result) => {
                                        if (err)
                                          return res.status(400).json(err);
                                        else {
                                          department = {
                                            Dept_ID: result[0].Dept_ID,
                                            admin: []
                                          };
                                          result.forEach(row => {
                                            Fname = row.Fname;
                                            Lname = row.Lname;
                                            if (Fname == null) {
                                              Fname = "";
                                            }
                                            if (Lname == null) {
                                              Lname = "";
                                            }
                                            Admin = {
                                              Admin_Name: Fname + " " + Lname,
                                              Admin_Email: row.Admin_Email
                                            };
                                            department.admin.push(Admin);
                                          });

                                          var transporter = nodemailer.createTransport(
                                            {
                                              service: "gmail",
                                              auth: {
                                                user:
                                                  "ulmevaluations@gmail.com",
                                                pass: "thebestulm"
                                              }
                                            }
                                          );

                                          const mailOptions = {
                                            from: "ulmevaluations@gmail.com", // sender address
                                            to: req.body.adminEmail, // list of receivers
                                            subject:
                                              "Welcome to ULM Evaluations ", // Subject line
                                            html:
                                              `<div><p>Welcome to ULM Evaluations</p>
                                      <p>You have been invited to join ULM Evaluations. Please click <a href="https://team-bear.herokuapp.com/register">here</a> to register and access your account today!</P><br><B>Please enter the following Temp Code during registration. <br>Temp Code: ` +
                                              Temp_Code +
                                              `
                                    </div>` // plain text body
                                          };
                                          transporter.sendMail(
                                            mailOptions,
                                            function(err, info) {
                                              if (err) console.log(err);
                                              else console.log("Email sent!");
                                            }
                                          );
                                          return res
                                            .status(200)
                                            .json(department);
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
);

// @route   Delete api/department/:Department_ID/deleteAdmin
// @desc    Delete an Admin to a department
// @access  Private
router.delete(
  "/:Department_ID/deleteAdmin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Department_ID = db.escape(req.params.Department_ID);
    let Admin_Email = db.escape(req.body.adminEmail);

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Department WHERE Department_ID=" + Department_ID;

          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res
                  .status(400)
                  .json({ Dept_ID: "Department Not found" });
              } else {
                let Dept_ID = db.escape(result[0].Dept_ID);

                unescaped_Dept_ID = result[0].Dept_ID;
                sql =
                  "SELECT * FROM Evaluators  E, PROGRAM_ADMIN  A  WHERE E.Email=A.Admin_Email AND E.Dept_ID= A.Dept_ID AND A.Dept_ID=" +
                  Dept_ID +
                  " AND A.Admin_Email =" +
                  Admin_Email;
                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    // console.log(sql);
                    //User Already exists, just make them Admin for that dept
                    if (result.length < 1) {
                      return res
                        .status(400)
                        .json({ Dept_ID: "User Not found" });
                    } else {
                      sql =
                        "DELETE FROM  PROGRAM_ADMIN WHERE Admin_Email=" +
                        Admin_Email +
                        " AND Dept_ID=" +
                        Dept_ID;
                      db.query(sql, (err, result) => {
                        if (err) return res.status(400).json(err);
                        else {
                          sql =
                            "SELECT * FROM Evaluators WHERE Email=" +
                            Admin_Email;

                          db.query(sql, (err, result) => {
                            if (
                              result[0].isActive == "false" &&
                              result[0].Password == null
                            ) {
                              sql =
                                "DELETE FROM Evaluators WHERE Email=" +
                                Admin_Email;

                              db.query(sql, (err, result) => {
                                sql =
                                  "SELECT * FROM Evaluators E, PROGRAM_ADMIN A WHERE E.Email=A.Admin_Email AND E.Dept_ID= A.Dept_ID AND A.Dept_ID=" +
                                  Dept_ID;

                                db.query(sql, (err, result) => {
                                  if (err) return res.status(400).json(err);
                                  else {
                                    department = {
                                      Dept_ID: unescaped_Dept_ID,
                                      admin: []
                                    };
                                    result.forEach(row => {
                                      Fname = row.Fname;
                                      Lname = row.Lname;
                                      if (Fname == null) {
                                        Fname = "";
                                      }
                                      if (Lname == null) {
                                        Lname = "";
                                      }
                                      Admin = {
                                        Admin_Name: Fname + " " + Lname,
                                        Admin_Email: row.Admin_Email
                                      };
                                      department.admin.push(Admin);
                                    });

                                    return res.status(200).json(department);
                                  }
                                });
                              });
                            } else {
                              sql =
                                "SELECT * FROM Evaluators E, PROGRAM_ADMIN A WHERE E.Email=A.Admin_Email AND E.Dept_ID= A.Dept_ID AND A.Dept_ID=" +
                                Dept_ID;

                              db.query(sql, (err, result) => {
                                if (err) return res.status(400).json(err);
                                else {
                                  department = {
                                    Dept_ID: unescaped_Dept_ID,
                                    admin: []
                                  };
                                  result.forEach(row => {
                                    Fname = row.Fname;
                                    Lname = row.Lname;
                                    if (Fname == null) {
                                      Fname = "";
                                    }
                                    if (Lname == null) {
                                      Lname = "";
                                    }
                                    Admin = {
                                      Admin_Name: Fname + " " + Lname,
                                      Admin_Email: row.Admin_Email
                                    };
                                    department.admin.push(Admin);
                                  });

                                  return res.status(200).json(department);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

// @route   Delete api/program/user/reset
// @desc   Reset password of an evaluator
// @access  Private
router.put(
  "/user/reset",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let Evaluator_Email = db.escape(req.body.Email.toLowerCase());
    let Password = db.escape(req.body.Password);
    let errors = {};
    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    if (!validator.isLength(req.body.Password, { min: 6, max: 20 })) {
      errors.Name = "Password must be 6-20 characters long";
      return res.status(400).json(errors);
    }
    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM Evaluators WHERE Email  = " + Evaluator_Email;

          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                errors.Email = "User not found";
              } else {
                sql =
                  "UPDATE Evaluators SET Password=PASSWORD(" +
                  Password +
                  ") WHERE  Email=" +
                  Evaluator_Email;

                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    return res
                      .status(200)
                      .json({ Email: "Password successfully updated" });
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);

module.exports = router;
