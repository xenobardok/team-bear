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

    const New_Dept_ID = db.escape(req.body.deptID);
    const New_Dept_Name = db.escape(req.body.deptName);

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

// @route   PUT api/department/:DeptID/update/name
// @desc    Updates the  department name
// @access  Private
router.put(
  "/:DeptID/update/name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    const Dept_ID = db.escape(req.params.DeptID);
    const New_Dept_Name = db.escape(req.body.deptName);

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
          sql = "SELECT * FROM Department WHERE Dept_ID=" + Dept_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res.status(400).json({ Dept_ID: "DepartmentNot found" });
              } else {
                sql =
                  "UPDATE Department Set  Department_Name=" +
                  New_Dept_Name +
                  " WHERE Dept_ID=" +
                  Dept_ID;

                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    newDept = {
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

// @route   PUT api/department/:DeptID/update/id
// @desc    Updates the  department id
// @access  Private
router.put(
  "/:DeptID/update/id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    const Dept_ID = db.escape(req.params.DeptID);
    const New_Dept_ID = db.escape(req.body.deptID);

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
          sql = "SELECT * FROM Department WHERE Dept_ID=" + Dept_ID;
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
                        " WHERE Dept_ID=" +
                        Dept_ID;
                      db.query(sql, (err, result) => {
                        if (err) return res.status(400).json(err);
                        else {
                          sql =
                            "SELECT * FROM Department WHERE Dept_ID=" +
                            New_Dept_ID;

                          db.query(sql, (err, result) => {
                            if (err) return res.status(400).json(err);
                            else {
                              newDept = {
                                Dept_ID: New_Dept_ID,
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

// @route   DELETE api/department/:DeptID/
// @desc    Updates the  department id
// @access  Private
router.delete(
  "/:DeptID/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    const Dept_ID = db.escape(req.params.DeptID);

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
          sql = "SELECT * FROM Department WHERE Dept_ID=" + Dept_ID;
          //   console.log(sql);
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                return res
                  .status(400)
                  .json({ Dept_ID: "Department Not found" });
              } else {
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
                                    "DELETE  FROM Department WHERE Dept_ID=" +
                                    Dept_ID;
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

module.exports = router;
