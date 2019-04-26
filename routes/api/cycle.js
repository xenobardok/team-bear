const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");
const validateCycleInput = require("../../validation/cycle");
const Validator = require("validator");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const csv = require("fast-csv");
const path = require("path");

const calculateMeasure = require("../calculateMeasure");
const updateStudentsScore = require("../updateStudentsScore");

const calculateTestMeasure = require("../calculateTestMeasure");
const updateStudentsTestScore = require("../updateStudentsTestScore");

const updateOutcome = require("../updateOutcome");

const validateUpdateRubric = require("../../validation/rubricMeasure");
const validateUpdateTest = require("../../validation/testMeasure");
const isEmpty = require("../../validation/isEmpty");

// @route   GET api/cycle
// @desc    Gets the lists of all rubrics
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;

    let sql =
      "SELECT * FROM ASSESSMENT_CYCLE WHERE isSubmitted='false' AND Dept_ID = ('" +
      dept +
      "') order by Dept_ID DESC";
    db.query(sql, (err, result) => {
      var cycles = [];
      if (err) return res.send(err);
      else if (result.length > 0) {
        result.forEach(row => {
          aCycle = {
            Cycle_ID: row.Cycle_ID,
            Cycle_Name: row.Cycle_Name,
            Is_Submitted: row.Is_Submitted
          };
          cycles.push(aCycle);
        });
      }
      // console.log(cycles);
      res.status(200).json(cycles);
    });
  }
);

// @route   GET api/cycle/active
// @desc    Gets the lists of all active rubrics
// @access  Private
router.get(
  "/active",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let sql =
      "SELECT * FROM ASSESSMENT_CYCLE WHERE Dept_ID = " +
      dept +
      " AND isSubmitted='false' order by Dept_ID DESC";
    db.query(sql, (err, result) => {
      var cycles = [];
      if (err) return res.send(err);
      else if (result.length > 0) {
        result.forEach(row => {
          aCycle = {
            Cycle_ID: row.Cycle_ID,
            Cycle_Name: row.Cycle_Name,
            Is_Submitted: row.Is_Submitted
          };
          cycles.push(aCycle);
        });
      }
      res.json(cycles);
    });
  }
);

// @route   GET api/cycle/submitted
// @desc    Gets the lists of all submitted rubrics
// @access  Private
router.get(
  "/submitted",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    let sql =
      "SELECT * FROM ASSESSMENT_CYCLE WHERE Dept_ID = " +
      dept +
      " AND isSubmitted='true' order by Dept_ID DESC";
    db.query(sql, (err, result) => {
      var cycles = [];
      if (err) return res.send(err);
      else if (result.length > 0) {
        result.forEach(row => {
          aCycle = {
            Cycle_ID: row.Cycle_ID,
            Cycle_Name: row.Cycle_Name,
            Is_Submitted: row.Is_Submitted
          };
          cycles.push(aCycle);
        });
      }
      res.json(cycles);
    });
  }
);

// @route   PUT api/cycle/:cycleID/submit
// @desc    Gets the lists of all active rubrics
// @access  Private
router.put(
  "/:cycleID/submit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Cycle_ID = req.params.cycleID;

    let sql =
      "SELECT * FROM ASSESSMENT_CYCLE WHERE DEPT_ID =" +
      dept +
      " AND Cycle_ID = " +
      Cycle_ID;

    db.query(sql, (err, result) => {
      if (err) res.send(err);
      else {
        if (result.length < 1) {
          return res.status(404).json({ error: "Cycle Not Found" });
        } else {
          sql =
            "UPDATE ASSESSMENT_CYCLE SET isSubmitted='true' WHERE Cycle_ID=" +
            Cycle_ID;
          db.query(sql, (err, result) => {
            if (err)
              return res
                .status(400)
                .json({ error: "There was some problem adding it" });
            else {
              return res
                .status(200)
                .json({ message: "Cycle Successfully Submitted" });
            }
          });
        }
      }
    });
  }
);

// @route   POST api/cycle
// @desc    Create a new cycle
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { errors, isValid } = validateCycleInput(req.body);

    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    if (!isValid) {
      return res.status(404).json(errors);
    } else {
      //console.log(req.user);
      if (type == "Admin") {
        const name = db.escape(req.body.Cycle_Name);
        let sql =
          "SELECT Cycle_ID FROM ASSESSMENT_CYCLE WHERE Dept_ID =" +
          dept +
          " AND Cycle_Name=" +
          name;
        //console.log(sql);
        db.query(sql, (err, result) => {
          if (err) res.send(err);
          else {
            if (result.length > 0) {
              errors.Cycle_Name = "Cycle with that name already exists.";
              return res.status(404).json(errors);
            }

            let False = db.escape("false");
            sql =
              "INSERT INTO ASSESSMENT_CYCLE(Cycle_Name, Dept_ID,isSubmitted) VALUES(" +
              name +
              "," +
              dept +
              "," +
              False +
              ")";

            db.query(sql, (err, result) => {
              if (err)
                return res
                  .status(400)
                  .json({ error: "There was some problem adding it" });
              else {
                let Cycle_ID = result.insertId;

                res.status(200).json(
                  (cycle = {
                    Cycle_ID: Cycle_ID,
                    Cycle_Name: req.body.Cycle_Name
                  })
                );
              }
            });
          }
        });
      } else {
        res.status(404).json({ error: "Not an Admin" });
      }
    }
  }
);

// @route   GET api/cycle/cycle:handle
// @desc    get the list of outcomes of a given cycle
// @access  Private route
router.get(
  "/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    if (type == "Admin") {
      const Cycle_ID = req.params.handle;
      const Cycle = {};

      let sql =
        "SELECT * FROM ASSESSMENT_CYCLE WHERE DEPT_ID =" +
        dept +
        " AND Cycle_ID = " +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            return res.status(404).json({ error: "Cycle Not Found" });
          }

          Cycle.Cycle_ID = Cycle_ID;
          Cycle.Cycle_Name = result[0].Cycle_Name;
          Cycle.Is_Submitted = result[0].isSubmitted;
          Cycle.data = [];
          sql =
            "SELECT * FROM OUTCOMES WHERE Cycle_ID = " +
            Cycle_ID +
            " ORDER BY Outcome_Index";

          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              i = 1;
              result.forEach(row => {
                outcome = {
                  Outcome_ID: row.Outcome_ID,
                  Outcome_Name: row.Outcome_Name,
                  Class_Factors: row.Class_Factors,
                  Outcome_Success: row.Outcome_Success,
                  Outcome_Index: i
                };
                i++;
                Cycle.data.push(outcome);
              });

              sql =
                "UPDATE Evaluators SET Last_Cycle_ID=" +
                Cycle_ID +
                " WHERE Email=" +
                email;
              db.query(sql, (err, result) => {
                if (err) res.send(err);
                return res.status(200).json(Cycle);
              });
            }
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   DElETE api/cycle/cycle:handle
// @desc    DELETE a cycle if there is no outcome
// @access  Private route
router.delete(
  "/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    if (type == "Admin") {
      const Cycle_ID = req.params.handle;
      const Cycle = {};

      let sql =
        "SELECT * FROM ASSESSMENT_CYCLE WHERE DEPT_ID =" +
        dept +
        " AND Cycle_ID = " +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            return res.status(404).json({ error: "Cycle Not Found" });
          } else {
            sql =
              "SELECT * FROM OUTCOMES WHERE Cycle_ID = " +
              Cycle_ID +
              " ORDER BY Outcome_Index";

            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                if (result.length > 0) {
                  return res
                    .status(404)
                    .json({ Outcomes: "Please delete outcomes first" });
                } else {
                  sql =
                    "DELETE FROM ASSESSMENT_CYCLE WHERE Cycle_ID=" + Cycle_ID;

                  db.query(sql, (err, result) => {
                    // console.log(sql);
                    if (err) return res.status(400).json(err);
                    else {
                      return res.status(200).json({ message: "Cycle deleted" });
                    }
                  });
                }
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   PUT api/cycle/cycle:handle
// @desc    Update a cycle name
// @access  Private route
router.put(
  "/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Cycle_Name = db.escape(req.body.Cycle_Name);

    if (type == "Admin") {
      const Cycle_ID = req.params.handle;
      const Cycle = {};

      let sql =
        "SELECT * FROM ASSESSMENT_CYCLE WHERE DEPT_ID =" +
        dept +
        " AND Cycle_ID = " +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            return res.status(404).json({ error: "Cycle Not Found" });
          } else {
            sql =
              "UPDATE  ASSESSMENT_CYCLE SET Cycle_Name=" +
              Cycle_Name +
              " WHERE Cycle_ID=" +
              Cycle_ID;

            db.query(sql, (err, result) => {
              if (err) return res.status(400).json(err);
              else {
                return res
                  .status(200)
                  .json({ Cycle_ID: Cycle_ID, Cycle_Name: Cycle_Name });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/create
// @desc    Create a new outcome
// @access  Private
router.post(
  "/:cycleID/outcome/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Cycle_ID = db.escape(req.params.cycleID);
    const Class_Factors = db.escape(req.body.Class_Factors);
    let Outcome_Name = req.body.Outcome_Name;

    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT isSubmitted from ASSESSMENT_CYCLE where Cycle_ID=" + Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          let isSubmitted = result[0].isSubmitted;

          if (isSubmitted == "true") {
            return res.status(400).json({ error: "Cycle has been submitted" });
          } else {
            if (isEmpty(Outcome_Name)) {
              errors.Outcome_Name = "Outcome Name cannot be empty";
              return res.status(404).json(errors);
            }
            Outcome_Name = db.escape(Outcome_Name);
            sql =
              "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
              dept +
              " AND Cycle_ID=" +
              Cycle_ID +
              " AND Outcome_Name =" +
              Outcome_Name;

            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                if (result.length > 0) {
                  errors.Cycle_Name = "Outcome with that name already exists.";
                  return res.status(404).json(errors);
                }

                sql =
                  "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
                  dept +
                  " AND Cycle_ID=" +
                  Cycle_ID;

                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(404).json(err);
                  } else {
                    sql =
                      "INSERT INTO OUTCOMES(Cycle_ID, Outcome_Name,Class_Factors) VALUES(" +
                      Cycle_ID +
                      "," +
                      Outcome_Name +
                      "," +
                      Class_Factors +
                      ")";
                    db.query(sql, (err, result) => {
                      if (err)
                        return res
                          .status(400)
                          .json({ error: "There was some problem adding it" });
                      else {
                        let Outcome_ID = db.escape(result.insertId);

                        res
                          .status(200)
                          .json((outcome = { Outcome_ID: Outcome_ID }));
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   DElETE api/cycle/:cycleID/outcome/:outcomeID
// @desc    DELETE an outcome if there is no measure
// @access  Private route
router.delete(
  "/:cycleID/outcome/:outcomeID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    if (type == "Admin") {
      const Cycle_ID = req.params.cycleID;
      const Outcome_ID = req.params.outcomeID;

      const Cycle = {};

      let sql =
        "SELECT * FROM ASSESSMENT_CYCLE NATURAL JOIN OUTCOMES WHERE DEPT_ID =" +
        dept +
        " AND Cycle_ID = " +
        Cycle_ID +
        " AND Outcome_ID=" +
        Outcome_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            return res.status(404).json({ error: "Outcome Not Found" });
          } else {
            sql =
              "SELECT * FROM MEASURES WHERE Outcome_ID = " +
              Outcome_ID +
              " ORDER BY Measure_Index";

            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                if (result.length > 0) {
                  return res
                    .status(404)
                    .json({ Measures: "Please delete measures first" });
                } else {
                  sql = "DELETE FROM OUTCOMES WHERE Outcome_ID=" + Outcome_ID;

                  db.query(sql, (err, result) => {
                    if (err) return res.status(400).json(err);
                    else {
                      // console.log(sql);
                      return res
                        .status(200)
                        .json({ message: "Outcome deleted" });
                    }
                  });
                }
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/update
// @desc    Update an old outcome
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/update", // updated from /update/:outcomeID
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Cycle_ID = db.escape(req.params.cycleID);
    const Outcome_ID = db.escape(req.params.outcomeID);
    const Class_Factors = db.escape(req.user.Class_Factors);
    let Outcome_Name = req.body.Outcome_Name;
    let errors = {};

    if (type == "Admin") {
      if (isEmpty(Outcome_Name)) {
        return res
          .status(404)
          .json((errors = { Outcome_Name: "Outcome Name cannot be empty" }));
      } else {
        Outcome_Name = db.escape(Outcome_Name);
        let sql =
          "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
          dept +
          " AND Cycle_ID=" +
          Cycle_ID +
          " AND Outcome_Name =" +
          Outcome_Name;

        db.query(sql, (err, result) => {
          if (err) res.send(err);
          else {
            if (result.length > 0) {
              errors.Outcome_Name = "Outcome with that name already exists.";
              return res.status(404).json(errors);
            } else {
              sql =
                "UPDATE OUTCOMES SET Outcome_Name = " +
                Outcome_Name +
                ", Class_Factors=" +
                Class_Factors +
                " WHERE Outcome_ID = " +
                Outcome_ID;

              db.query(sql, (err, result) => {
                if (err)
                  return res
                    .status(400)
                    .json({ error: "There was some problem updating it" });
                else {
                  res.status(200).json("Outcome was successfully updated");
                }
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

// @route   GET api/cycle/:cycleID/outcome/outcome:handle
// @desc    get the list of measures of a given cycle
// @access  Private route
router.get(
  "/:cycleID/outcome/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      const Cycle_ID = req.params.cycleID;
      const Outcome_ID = req.params.handle;
      const Outcome = {};

      let sql =
        "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Outcome_ID =" +
        Outcome_ID +
        "  AND Cycle_ID=" +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Outcome_Name = "Outcome not found";
            return res.status(200).json(errors);
          }

          Outcome.Outcome_ID = Outcome_ID;
          Outcome.Cycle_ID = result[0].Cycle_ID;
          Outcome.Class_Factors = result[0].Class_Factors;

          Outcome.data = [];
          sql =
            "SELECT * FROM MEASURES WHERE Outcome_ID= " +
            Outcome_ID +
            " ORDER BY Measure_Index";

          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              i = 1;
              result.forEach(row => {
                measure = {
                  Measure_ID: row.Measure_ID,
                  Measure_Name: row.Measure_label,
                  Measure_Index: i,
                  Measure_type: row.Measure_type,
                  Measure_Success: row.isSuccess
                };
                updateOutcome(row.Measure_ID);
                i++;
                Outcome.data.push(measure);
              });

              return res.status(200).json(Outcome);
            }
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/:outcomeID/measure/create
// @desc    Create a new Rubric Measure
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/measure/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const outcomeID = db.escape(req.params.outcomeID);
    const Cycle_ID = req.params.cycleID;
    let Measure_Name = req.body.Measure_Name;
    let Measure_Type = req.body.Measure_Type;
    const errors = {};

    if (type == "Admin") {
      //console.log(isEmpty(Outcome_Name));
      if (isEmpty(Measure_Name)) {
        errors.Measure_Name = "Measure Name cannot be empty";
        return res.status(404).json(errors);
      } else {
        let sql = " SELECT * FROM  ASSESSMENT_CYCLE WHERE Cycle_ID=" + Cycle_ID;
        db.query(sql, (err, result) => {
          if (err) res.send(err);
          if (result[0].iSubmitted == "true") {
            errors.Measure_Name = "Cycle is already closed.";
            return res.status(400).json(errors);
          } else {
            Measure_Name = db.escape(Measure_Name);
            sql =
              "SELECT * FROM MEASURES WHERE Outcome_ID =" +
              outcomeID +
              " AND Measure_label=" +
              Measure_Name;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                if (result.length > 0) {
                  errors.Measure_Name =
                    "Measure Name with that name already exists.";
                  return res.status(404).json(errors);
                }

                sql = "SELECT * FROM MEASURES WHERE Outcome_ID =" + outcomeID;
                db.query(sql, (err, result) => {
                  if (err) res.send(err);
                  else {
                    let isSuccess = db.escape("false");
                    let isCompleted = db.escape("false");

                    sql =
                      "INSERT INTO MEASURES(Measure_label,isSuccess, Outcome_ID,Measure_type) VALUES(" +
                      Measure_Name +
                      "," +
                      isSuccess +
                      "," +
                      outcomeID +
                      "," +
                      db.escape(Measure_Type) +
                      ")";
                    db.query(sql, (err, result) => {
                      if (err)
                        return res
                          .status(400)
                          .json({ error: "There was some problem adding it" });
                      else {
                        let Measure_ID = db.escape(result.insertId);

                        //If Measure_Type is rubric, create a rubric measure
                        if (Measure_Type === "rubric") {
                          sql =
                            "INSERT INTO RUBRIC_MEASURES(Measure_ID,Is_Success ) VALUES(" +
                            Measure_ID +
                            "," +
                            isSuccess +
                            ")";

                          db.query(sql, (err, result) => {
                            if (err)
                              return res.status(400).json({
                                error: "There was some problem adding it"
                              });
                            else {
                              Rubric_Measure_ID = db.escape(result.insertId);

                              Rubric_Measure = {
                                Measure_ID: Measure_ID,
                                Rubric_Measure_ID: Rubric_Measure_ID
                              };
                              // updateOutcome(outcomeID);
                              return res.status(200).json(Rubric_Measure);
                            }
                          });
                        } else {
                          //Create a Test Measure
                          sql =
                            "INSERT INTO TEST_MEASURES(Measure_ID,Is_Success ) VALUES(" +
                            Measure_ID +
                            "," +
                            isSuccess +
                            ")";

                          db.query(sql, (err, result) => {
                            if (err)
                              return res.status(400).json({
                                error: "There was some problem adding it"
                              });
                            else {
                              Test_Measure_ID = db.escape(result.insertId);

                              Test_Measure = {
                                Measure_ID: Measure_ID,
                                Test_Measure_ID: Test_Measure_ID
                              };
                              return res.status(200).json(Test_Measure);
                            }
                          });
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   DElETE api/cycle/:cycleID/outcome/:outcomeID/measure/:measureID
// @desc    DELETE a measure if there is no information
// @access  Private route
router.delete(
  "/:cycleID/outcome/:outcomeID/measure/:measureID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    if (type == "Admin") {
      const Outcome_ID = req.params.outcomeID;
      const Measure_ID = req.params.measureID;
      const Cycle_ID = req.params.cycleID;

      let sql =
        "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE NATURAL JOIN MEASURES WHERE isSubmitted='false' AND Outcome_ID=" +
        Outcome_ID +
        " AND Measure_ID=" +
        Measure_ID +
        " AND Cycle_ID=" +
        Cycle_ID;

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            return res
              .status(404)
              .json({ error: "Measure Not Found OR Cycle is Closed" });
          } else {
            let Measure_Type = result[0].Measure_type;
            if (Measure_Type == "rubric") {
              sql =
                "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID=" + Measure_ID;

              db.query(sql, (err, result) => {
                if (err) {
                  return res.status(400).json(err);
                } else {
                  let Rubric_Measure_ID = result[0].Rubric_Measure_ID;

                  sql =
                    "SELECT * FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                    Rubric_Measure_ID;

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json(err);
                    } else {
                      if (result.length > 0) {
                        return res
                          .status(400)
                          .json({ students: "Please delete Students First" });
                      } else {
                        sql =
                          "SELECT * FROM RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
                          Rubric_Measure_ID;
                        db.query(sql, (err, result) => {
                          if (err) {
                            return res.status(400).json(err);
                          } else {
                            if (result.length > 0) {
                              return res.status(400).json({
                                evaluators: "Please delete Evaluators First"
                              });
                            } else {
                              sql =
                                "DELETE FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
                                Rubric_Measure_ID;
                              db.query(sql, (err, result) => {
                                if (err) {
                                  return res.status(400).json(err);
                                } else {
                                  sql =
                                    "DELETE FROM MEASURES WHERE Measure_ID=" +
                                    Measure_ID;
                                  db.query(sql, (err, result) => {
                                    if (err) {
                                      return res.status(400).json(err);
                                    } else {
                                      return res.status(200).json({
                                        message: "Measure successfully deleted"
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
              });
            } else {
              sql =
                "SELECT * FROM TEST_MEASURES WHERE Measure_ID=" + Measure_ID;

              db.query(sql, (err, result) => {
                if (err) {
                  return res.status(400).json(err);
                } else {
                  let Test_Measure_ID = result[0].Test_Measure_ID;

                  sql =
                    "SELECT * FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                    Test_Measure_ID;

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json(err);
                    } else {
                      if (result.length > 0) {
                        return res
                          .status(400)
                          .json({ students: "Please delete Students First" });
                      } else {
                        sql =
                          "SELECT * FROM TEST_MEASURE_EVALUATOR WHERE Test_Measure_ID=" +
                          Test_Measure_ID;
                        db.query(sql, (err, result) => {
                          if (err) {
                            return res.status(400).json(err);
                          } else {
                            if (result.length > 0) {
                              return res.status(400).json({
                                evaluators: "Please delete Evaluators First"
                              });
                            } else {
                              sql =
                                "DELETE FROM TEST_MEASURES WHERE Test_Measure_ID=" +
                                Test_Measure_ID;
                              db.query(sql, (err, result) => {
                                if (err) {
                                  return res.status(400).json(err);
                                } else {
                                  sql =
                                    "DELETE FROM MEASURES WHERE Measure_ID=" +
                                    Measure_ID;
                                  db.query(sql, (err, result) => {
                                    if (err) {
                                      return res.status(400).json(err);
                                    } else {
                                      return res.status(200).json({
                                        message: "Measure successfully deleted"
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
              });
            }
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   GET api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID
// @desc    get the details of a given measure
// @access  Private route
router.get(
  "/:cycleID/outcome/:outcomeID/measure/:measureID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      const Outcome_ID = req.params.outcomeID;
      const Measure_ID = req.params.measureID;
      const Cycle_ID = req.params.cycleID;
      const Measure = {};
      let sql =
        "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE NATURAL JOIN MEASURES WHERE Outcome_ID =" +
        Outcome_ID +
        " AND Measure_ID=" +
        Measure_ID +
        " AND Cycle_ID=" +
        Cycle_ID;

      // updateOutcome(Measure_ID);

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Outcome_Name = "Measure not found";
            return res.status(200).json(errors);
          } else {
            Measure.Measure_ID = Measure_ID;
            Measure.Measure_Label = result[0].Measure_label;
            Measure.Measure_Type = result[0].Measure_type;

            if (Measure.Measure_Type == "rubric") {
              sql =
                " SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID=" + Measure_ID;
              db.query(sql, (err, result) => {
                if (err) return res.status(200).json(err);
                else {
                  Rubric_Measure_ID = result[0].Rubric_Measure_ID;
                  Measure.Rubric_ID = result[0].Rubric_ID;
                  Measure.End_Date = result[0].End_Date;
                  Measure.Target = result[0].Target;
                  Measure.Threshold = result[0].Threshold;
                  Measure.Achieved_Threshold = result[0].Score;
                  Measure.Is_Success = result[0].Is_Success;
                  Measure.Class_Name = result[0].Class_Name;

                  calculateMeasure(Rubric_Measure_ID);

                  sql =
                    "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE NATURAL JOIN RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
                    Rubric_Measure_ID +
                    " AND Rubric_ID=" +
                    Measure.Rubric_ID;

                  db.query(sql, (err, result) => {
                    if (err) throw err;
                    else {
                      const Total_Students = result[0].Total;
                      Measure.Total_Students = Total_Students;

                      //sql to find the count of students with required or better grade
                      sql =
                        "SELECT Count(*) AS Success_Count FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                        Rubric_Measure_ID +
                        " AND Student_Avg_Grade>=" +
                        Measure.Target;

                      db.query(sql, (err, result) => {
                        if (err) throw err;
                        else {
                          Measure.Student_Achieved_Target_Count =
                            result[0].Success_Count;

                          sql =
                            " SELECT Did_Submit,Evaluator_Email,CONCAT( Fname,' ', Lname) AS FullName FROM RUBRIC_MEASURES NATURAL JOIN RUBRIC_MEASURE_EVALUATOR EV JOIN Evaluators E on EV.Evaluator_Email = E.Email WHERE Rubric_Measure_ID = " +
                            Rubric_Measure_ID;
                          //console.log(sql);
                          Measure.Evaluators = [];
                          db.query(sql, (err, result) => {
                            if (err) res.status(400).json(err);
                            result.forEach(row => {
                              evaluator = {
                                Evaluator_Email: row.Evaluator_Email,
                                Evaluator_Name: row.FullName,
                                hasSubmitted: row.Did_Submit
                              };
                              Measure.Evaluators.push(evaluator);
                            });

                            Measure.Students = [];

                            sql =
                              "SELECT Student_ID, Student_Name FROM RUBRIC_STUDENTS NATURAL JOIN RUBRIC_MEASURES WHERE Rubric_Measure_ID= " +
                              Rubric_Measure_ID +
                              " ORDER BY Student_Name ASC";

                            db.query(sql, (err, result) => {
                              if (err) res.status(400).json(err);
                              result.forEach(row => {
                                student = {
                                  Student_ID: row.Student_ID,
                                  Student_Name: row.Student_Name
                                };
                                Measure.Students.push(student);
                              });
                              Measure.Rubric_Name = "";

                              sql =
                                " SELECT Rubric_Name FROM RUBRIC_MEASURES  NATURAL JOIN RUBRIC WHERE Measure_ID=" +
                                Measure_ID;

                              db.query(sql, (err, result) => {
                                if (err) res.status(400).json(err);
                                if (result.length > 0) {
                                  Measure.Rubric_Name = result[0].Rubric_Name;
                                }

                                sql =
                                  "SELECT DISTINCT S.Student_Name AS Student_Name,CONCAT(EV.Fname,' ',EV.Lname) AS Evaluator_Name FROM ALL_ASSIGNED A LEFT JOIN EVALUATED E ON A.Student_ID = E.Student_ID AND A.Evaluator_Email= E.Evaluator_Email AND A.Rubric_ID=E.Rubric_ID AND A.Rubric_Measure_ID=E.Rubric_Measure_ID JOIN RUBRIC_STUDENTS S ON A.Student_ID=S.Student_ID AND A.Rubric_Measure_ID=S.Rubric_Measure_ID JOIN Evaluators EV ON EV.Email = A.Evaluator_Email WHERE E.Student_ID IS null AND A.Rubric_ID=" +
                                  Measure.Rubric_ID +
                                  " AND A.Rubric_Measure_ID=" +
                                  Rubric_Measure_ID +
                                  " ORDER BY A.Evaluator_Email, Student_Name ASC ";

                                // console.log(sql);
                                db.query(sql, (err, result) => {
                                  if (err) res.status(400).json(err);
                                  Measure.Unevaluated = [];
                                  result.forEach(row => {
                                    let Student_Name = row.Student_Name;
                                    let Evaluator_Name = row.Evaluator_Name;

                                    let isFound = false;

                                    Measure.Unevaluated.forEach(Evaluator => {
                                      if (
                                        Evaluator.Evaluator_Name ==
                                        Evaluator_Name
                                      ) {
                                        Evaluator.Student_List.push(
                                          Student_Name
                                        );
                                        isFound = true;
                                      }
                                    });
                                    if (!isFound) {
                                      Evaluator = {
                                        Evaluator_Name: Evaluator_Name,
                                        Student_List: [Student_Name]
                                      };
                                      Measure.Unevaluated.push(Evaluator);
                                    }
                                  });
                                  res.status(200).json(Measure);
                                });
                              });
                            });
                          });
                        }
                      });
                    }
                  });
                }
              });
            } else {
              // for test measure

              sql =
                " SELECT * FROM TEST_MEASURES WHERE Measure_ID=" + Measure_ID;
              db.query(sql, (err, result) => {
                if (err) return res.status(200).json(err);
                else {
                  Test_Measure_ID = result[0].Test_Measure_ID;
                  Measure.End_Date = result[0].End_Date;
                  Measure.Target = result[0].Target;
                  Measure.Threshold = result[0].Threshold;
                  Measure.Achieved_Threshold = result[0].Score;
                  Measure.Is_Success = result[0].Is_Success;
                  Measure.Test_Name = result[0].Exam_Name;
                  Measure.Test_Type = result[0].Test_Type;

                  calculateTestMeasure(Test_Measure_ID);
                  sql =
                    "SELECT DISTINCT(COUNT(*)) AS Total FROM STUDENTS_TEST_GRADE G NATURAL JOIN TEST_STUDENTS  S NATURAL JOIN TEST_MEASURE_EVALUATOR  WHERE G.Test_Measure_ID=" +
                    Test_Measure_ID;

                  db.query(sql, (err, result) => {
                    // console.log(sql);

                    if (err) throw err;
                    else {
                      const Total_Students = result[0].Total;
                      Measure.Total_Students = Total_Students;

                      //sql to find the count of students with required or better grade
                      sql =
                        "SELECT Count(*) AS Success_Count FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                        Test_Measure_ID +
                        " AND Student_Avg_Grade>=" +
                        Measure.Target;

                      db.query(sql, (err, result) => {
                        // console.log(sql);

                        if (err) throw err;
                        else {
                          Measure.Student_Achieved_Target_Count =
                            result[0].Success_Count;

                          sql =
                            "SELECT Student_ID, Student_Name FROM TEST_STUDENTS NATURAL JOIN TEST_MEASURES WHERE Test_Measure_ID= " +
                            Test_Measure_ID +
                            " ORDER BY Student_Name ASC";

                          Measure.Students = [];
                          db.query(sql, (err, result) => {
                            if (err) res.status(400).json(err);
                            // console.log(result);

                            result.forEach(row => {
                              student = {
                                Student_ID: row.Student_ID,
                                Student_Name: row.Student_Name
                              };
                              Measure.Students.push(student);
                            });

                            sql =
                              " SELECT Did_Submit,Evaluator_Email,CONCAT( Fname,' ', Lname) AS FullName FROM TEST_MEASURES NATURAL JOIN TEST_MEASURE_EVALUATOR EV JOIN Evaluators E on EV.Evaluator_Email = E.Email WHERE Test_Measure_ID = " +
                              Test_Measure_ID;

                            Measure.Evaluators = [];
                            db.query(sql, (err, result) => {
                              if (err) res.status(400).json(err);

                              result.forEach(row => {
                                evaluator = {
                                  Evaluator_Email: row.Evaluator_Email,
                                  Evaluator_Name: row.FullName,
                                  hasSubmitted: row.Did_Submit
                                };
                                Measure.Evaluators.push(evaluator);
                              });
                              // console.log(sql);
                              sql =
                                "SELECT * FROM TEST_STUDENTS S WHERE S.Test_Student_ID NOT IN (SELECT Test_Student_ID FROM STUDENTS_TEST_GRADE) AND Test_Measure_ID=" +
                                Test_Measure_ID +
                                " ORDER BY S.Student_Name";
                              db.query(sql, (err, result) => {
                                if (err) res.status(400).json(err);
                                Measure.Unevaluated = [];

                                // console.log(sql);
                                if (
                                  result.length > 0 &&
                                  Measure.Evaluators.length > 0
                                ) {
                                  Evaluator = {
                                    Evaluator_Name:
                                      Measure.Evaluators[0].Evaluator_Name,
                                    Student_List: []
                                  };
                                  result.forEach(row => {
                                    Evaluator.Student_List.push(
                                      row.Student_Name
                                    );
                                  });

                                  Measure.Unevaluated.push(Evaluator);
                                  return res.status(200).json(Measure);
                                } else {
                                  return res.status(200).json(Measure);
                                }
                              });

                              // console.log(Measure);
                            });
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID/edit
// @desc    Update a new Rubric Measure
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const outcomeID = db.escape(req.params.outcomeID);
    let Measure_Name = req.body.Measure_Name;
    const Measure_ID = req.params.measureID;
    const Cycle_ID = req.params.cycleID;

    const errors = {};
    if (type == "Admin") {
      let sql = " SELECT * FROM  ASSESSMENT_CYCLE WHERE Cycle_ID=" + Cycle_ID;
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        if (result[0].iSubmitted == "true") {
          errors.Measure_Name = "Cycle is already closed.";
          return res.status(400).json(errors);
        } else {
          //console.log(isEmpty(Outcome_Name));
          if (isEmpty(Measure_Name)) {
            return res
              .status(404)
              .json((errors.Measure_Name = "Measure Name cannot be empty"));
          }
          Measure_Name = db.escape(Measure_Name);
          sql =
            "SELECT * FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Outcome_ID =" +
            outcomeID +
            " AND Measure_ID=" +
            Measure_ID +
            " AND Cycle_ID=" +
            Cycle_ID;
          // console.log(sql);
          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              if (result.length < 1) {
                errors.Measure_Name = "Measure does not exist.";
                return res.status(404).json(errors);
              }
              // console.log(result[0]);
              sql =
                "UPDATE MEASURES SET Measure_label=" +
                Measure_Name +
                " WHERE Outcome_ID =" +
                outcomeID +
                " AND Measure_ID=" +
                Measure_ID;

              db.query(sql, (err, result) => {
                if (err) res.send(err);
                else {
                  return res
                    .status(200)
                    .json({ message: "Successfully renamed the Measure." });
                }
              });
            }
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle//:cycleID/outcome/:outcomeID/measure/:MeasureID/update
// @desc    Update a Measure details
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    // const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Measure_ID = req.params.measureID;
    const Outcome_ID = req.params.outcomeID;
    const Cycle_ID = req.params.cycleID;

    console.log(req.params);
    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT Measure_type FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE isSubmitted= 'false' AND Measure_ID = " +
        Measure_ID +
        " AND Outcome_ID=" +
        Outcome_ID +
        " AND Cycle_ID=" +
        Cycle_ID;

      console.log(sql);
      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          if (result.length < 1) {
            errors.error = "Measure Not found or  Cycle is Closed";
            return res.status(404).json(errors);
          }
          //for rubric Measure Type
          if (result[0].Measure_type == "rubric") {
            sql =
              "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Rubric_Measure_ID = result[0].Rubric_Measure_ID;

                //Threshold is %  of total students
                //Target is target score
                //Rubric_ID is the assigned Rubric ID
                //add date later

                const { errors, isValid } = validateUpdateRubric(req.body);

                if (!isValid) {
                  return res.status(404).json(errors);
                }

                Threshold = req.body.Threshold;
                Target = db.escape(req.body.Target);
                Rubric_ID = req.body.Rubric_ID;
                const Class_Name = db.escape(req.body.Class_Name);

                //leave for date

                sql =
                  "SELECT * FROM RUBRIC WHERE Rubric_ID = " +
                  Rubric_ID +
                  " AND  Dept_ID=" +
                  dept;
                db.query(sql, (err, result) => {
                  if (err) {
                    return res
                      .status(400)
                      .json({ error: "There was some problem adding it" });
                  }

                  if (result.length < 1) {
                    return res.status(400).json({ error: "Rubric Not found." });
                  }

                  sql =
                    "UPDATE RUBRIC_MEASURES SET Threshold=" +
                    Threshold +
                    ", Target =" +
                    Target +
                    ", Rubric_ID=" +
                    Rubric_ID +
                    ", Class_Name=" +
                    Class_Name +
                    " WHERE Rubric_Measure_ID=" +
                    Rubric_Measure_ID;

                  // console.log(sql);

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res
                        .status(400)
                        .json({ error: "There was some problem adding it" });
                    } else {
                      updateStudentsScore(Rubric_Measure_ID, () => {
                        Measure = {};
                        sql =
                          " SELECT * FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
                          Rubric_Measure_ID;
                        db.query(sql, (err, result) => {
                          if (err) return res.status(200).json(err);
                          else {
                            Measure.Rubric_ID = result[0].Rubric_ID;
                            Measure.End_Date = result[0].End_Date;
                            Measure.Target = result[0].Target;
                            Measure.Threshold = result[0].Threshold;
                            Measure.Achieved_Threshold = result[0].Score;
                            Measure.Is_Success = result[0].Is_Success;
                            Measure.Class_Name = result[0].Class_Name;
                            Measure.Score = result[0].Score;

                            calculateMeasure(Rubric_Measure_ID);

                            sql =
                              "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE WHERE Rubric_Measure_ID=" +
                              Rubric_Measure_ID +
                              " AND Rubric_ID=" +
                              Measure.Rubric_ID;

                            db.query(sql, (err, result) => {
                              if (err) throw err;
                              else {
                                const Total_Students = result[0].Total;
                                Measure.Total_Students = Total_Students;

                                //sql to find the count of students with required or better grade
                                sql =
                                  "SELECT Count(*) AS Success_Count FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                                  Rubric_Measure_ID +
                                  " AND Student_Avg_Grade>=" +
                                  Measure.Target;

                                db.query(sql, (err, result) => {
                                  if (err) throw err;
                                  else {
                                    Measure.Student_Achieved_Target_Count =
                                      result[0].Success_Count;

                                    sql =
                                      " SELECT Rubric_Name FROM RUBRIC_MEASURES  NATURAL JOIN RUBRIC WHERE Measure_ID=" +
                                      Measure_ID;

                                    db.query(sql, (err, result) => {
                                      if (err) res.status(400).json(err);
                                      if (result.length > 0) {
                                        Measure.Rubric_Name =
                                          result[0].Rubric_Name;
                                      }
                                      // console.log(Measure);
                                      return res.status(200).json(Measure);
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      });
                    }
                  });
                });
              }
            });
          }
          //for Test Measure Type
          else {
            sql = "SELECT * FROM TEST_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Test_Measure_ID = result[0].Test_Measure_ID;

                //Threshold is %  of total students
                //Target is target score
                //Test_Name is the name of Test
                //add date later
                // Test_Type is the type of the test

                const { errors, isValid } = validateUpdateTest(req.body);

                if (!isValid) {
                  return res.status(404).json(errors);
                }

                Threshold = req.body.Threshold;
                Target = req.body.Target;
                const Exam_Name = db.escape(req.body.Test_Name);
                const Test_Type = db.escape(req.body.Test_Type); // 'pass/fail' or 'score'

                sql =
                  "UPDATE TEST_MEASURES SET Threshold=" +
                  Threshold +
                  ", Target =" +
                  Target +
                  ", Exam_Name=" +
                  Exam_Name +
                  ", Test_Type =" +
                  Test_Type +
                  " WHERE Test_Measure_ID=" +
                  Test_Measure_ID;

                db.query(sql, (err, result) => {
                  if (err) {
                    return res
                      .status(400)
                      .json({ error: "There was some problem adding it" });
                  } else {
                    updateStudentsTestScore(Test_Measure_ID, () => {
                      Measure = {};
                      sql =
                        " SELECT * FROM TEST_MEASURES WHERE Test_Measure_ID=" +
                        Test_Measure_ID;
                      db.query(sql, (err, result) => {
                        if (err) return res.status(200).json(err);
                        else {
                          Measure.End_Date = result[0].End_Date;
                          Measure.Target = result[0].Target;
                          Measure.Threshold = result[0].Threshold;
                          Measure.Achieved_Threshold = result[0].Score;
                          Measure.Is_Success = result[0].Is_Success;
                          Measure.Test_Name = result[0].Test_Name;
                          Measure.Test_Type = result[0].Test_Type;

                          calculateTestMeasure(Test_Measure_ID);
                          sql =
                            "SELECT Count(DISTINCT(Student_ID)) AS Total FROM TEST_STUDENTS NATURAL JOIN STUDENTS_TEST_GRADE WHERE Test_Measure_ID=" +
                            Test_Measure_ID;

                          db.query(sql, (err, result) => {
                            if (err) throw err;
                            else {
                              const Total_Students = result[0].Total;
                              Measure.Total_Students = Total_Students;

                              //sql to find the count of students with required or better grade
                              sql =
                                "SELECT Count(*) AS Success_Count FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                                Test_Measure_ID +
                                " AND Student_Avg_Grade>=" +
                                Measure.Target;

                              db.query(sql, (err, result) => {
                                if (err) throw err;
                                else {
                                  Measure.Student_Achieved_Target_Count =
                                    result[0].Success_Count;

                                  // console.log(Measure);
                                  return res.status(200).json(Measure);
                                }
                              });
                            }
                          });
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID/addEvaluator
// @desc    Add an evaluator to a Rubric Measure
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/addEvaluator",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Measure_ID = db.escape(req.params.measureID);
    const Outcome_ID = req.params.outcomeID;
    const Cycle_ID = req.params.cycleID;

    Evaluator_Email = req.body.Evaluator_Email;

    const errors = {};

    if (type == "Admin") {
      let sql =
        "SELECT Measure_type FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE isSubmitted= 'false' AND Measure_ID = " +
        Measure_ID +
        " AND Outcome_ID=" +
        Outcome_ID +
        " AND Cycle_ID=" +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          if (result.length < 1) {
            errors.error = "Measure Not found OR  Cycle is Closed";
            return res.status(404).json(errors);
          }
          //for rubric Measure Type
          if (result[0].Measure_type == "rubric") {
            sql =
              "SELECT * FROM RUBRIC_MEASURES  M JOIN RUBRIC R ON R.Rubric_ID=M.Rubric_ID WHERE Measure_ID =" +
              Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                if (result.length < 1) {
                  errors.Measure = "Measure needs to be  defined first";
                  return res.status(400).json(errors);
                }
                let Rubric_Measure_ID = result[0].Rubric_Measure_ID;
                let Class_Name = result[0].Class_Name;
                let Rubric_Name = result[0].Rubric_Name;

                if (isEmpty(Evaluator_Email)) {
                  errors.Evaluator_Email = "Evaluator email cannot be empty";
                  return res.status(404).json(errors);
                }

                if (!Validator.isEmail(Evaluator_Email)) {
                  errors.Evaluator_Email = "Evaluator email is not valid";
                  return res.status(404).json(errors);
                }
                Evaluator_Email = db.escape(Evaluator_Email);

                sql =
                  "SELECT * FROM Evaluators WHERE Email = " + Evaluator_Email;
                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem adding the Evaluator"
                    });
                  }

                  if (result.length < 1) {
                    return res
                      .status(400)
                      .json({ error: "Evaluator not found" });
                  }
                  let Evaluator_Name = result[0].Fname + " " + result[0].Lname;
                  sql =
                    "SELECT * FROM RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
                    Rubric_Measure_ID +
                    " AND Evaluator_Email=" +
                    Evaluator_Email;

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem adding the Evaluator"
                      });
                    }

                    if (result.length > 0) {
                      return res
                        .status(400)
                        .json({ error: "Evaluator is already assigned" });
                    }
                    sql =
                      "INSERT INTO RUBRIC_MEASURE_EVALUATOR (Rubric_Measure_ID,Evaluator_Email) VALUES(" +
                      Rubric_Measure_ID +
                      "," +
                      Evaluator_Email +
                      ")";

                    db.query(sql, (err, result) => {
                      if (err) {
                        return res.status(400).json({
                          error: "There was some problem adding  the evaluator"
                        });
                      } else {
                        updateStudentsScore(Rubric_Measure_ID, () => {});
                        message =
                          " have been assigned to evaluate the Rubric " +
                          Rubric_Name +
                          " in class " +
                          Class_Name +
                          ".";
                        sql =
                          "INSERT INTO ACTIVITY_LOG(From_Dept_ID,To_Email,Message) VALUES(" +
                          dept +
                          "," +
                          Evaluator_Email +
                          "," +
                          db.escape(message) +
                          ")";
                        // console.log(sql);
                        db.query(sql, (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error:
                                "There was some problem adding  the evaluator"
                            });
                          }
                          return res.status(200).json({
                            // message: "Evaluator has successfully been assigned."
                            Evaluator_Email: req.body.Evaluator_Email,
                            Evaluator_Name: Evaluator_Name
                          });
                        });
                      }
                    });
                  });
                });
              }
            });
          } else {
            //for test
            sql = "SELECT * FROM TEST_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                if (result.length < 1) {
                  errors.Measure = "Measure needs to be  defined first";
                  return res.status(400).json(errors);
                }
                let Test_Measure_ID = result[0].Test_Measure_ID;
                let Test_Name = result[0].Exam_Name;

                sql =
                  "SELECT * FROM TEST_MEASURE_EVALUATOR WHERE Test_Measure_ID = " +
                  Test_Measure_ID;

                db.query(sql, (err, result) => {
                  if (err) {
                    return res
                      .status(400)
                      .json({ error: "There was message adding an evaluator" });
                  } else {
                    if (result.length > 0) {
                      return res.status(400).json({
                        error: "An evaluator has already been assigned."
                      });
                    }
                    if (isEmpty(Evaluator_Email)) {
                      errors.Evaluator_Email =
                        "Evaluator email cannot be empty";
                      return res.status(404).json(errors);
                    }

                    if (!Validator.isEmail(Evaluator_Email)) {
                      errors.Evaluator_Email = "Evaluator email is not valid";
                      return res.status(404).json(errors);
                    }
                    Evaluator_Email = db.escape(Evaluator_Email);

                    sql =
                      "SELECT * FROM Evaluators WHERE Email = " +
                      Evaluator_Email;

                    db.query(sql, (err, result) => {
                      if (err) {
                        return res.status(400).json({
                          error: "There was some problem adding the Evaluator"
                        });
                      }

                      if (result.length < 1) {
                        return res
                          .status(400)
                          .json({ error: "Evaluator not found" });
                      }
                      let Evaluator_Name =
                        result[0].Fname + " " + result[0].Lname;

                      sql =
                        "INSERT INTO TEST_MEASURE_EVALUATOR (Test_Measure_ID,Evaluator_Email) VALUES(" +
                        Test_Measure_ID +
                        "," +
                        Evaluator_Email +
                        ")";

                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error:
                              "There was some problem adding  the evaluator"
                          });
                        } else {
                          updateStudentsTestScore(Test_Measure_ID, () => {});

                          message =
                            " have been assigned to evaluate scores for the test  " +
                            Test_Name +
                            ".";
                          sql =
                            "INSERT INTO ACTIVITY_LOG(From_Dept_ID,To_Email,Message) VALUES(" +
                            dept +
                            "," +
                            Evaluator_Email +
                            "," +
                            db.escape(message) +
                            ")";
                          // console.log(sql);
                          db.query(sql, (err, result) => {
                            if (err) {
                              return res.status(400).json({
                                error:
                                  "There was some problem adding  the evaluator"
                              });
                            }
                            return res.status(200).json({
                              // message: "Evaluator has successfully been assigned."
                              Evaluator_Email: req.body.Evaluator_Email,
                              Evaluator_Name: Evaluator_Name
                            });
                          });
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   DELETE api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID/removeEvaluator
// @desc    Removes an evaluator to a Rubric Measure
// @access  Private
router.delete(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/removeEvaluator",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Measure_ID = db.escape(req.params.measureID);
    const Outcome_ID = req.params.outcomeID;
    const Cycle_ID = req.params.cycleID;

    Evaluator_Email = req.body.Evaluator_Email;

    const errors = {};

    if (type == "Admin") {
      let sql =
        "SELECT Measure_type FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE isSubmitted= 'false' AND Measure_ID = " +
        Measure_ID +
        " AND Outcome_ID=" +
        Outcome_ID +
        " AND Cycle_ID=" +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          if (result.length < 1) {
            errors.error = "Measure Not found Or the  cycle is closed";
            return res.status(404).json(errors);
          }
          //for rubric Measure Type
          if (result[0].Measure_type == "rubric") {
            sql =
              "SELECT * FROM RUBRIC_MEASURES M JOIN RUBRIC R ON R.Rubric_ID=M.Rubric_ID  WHERE Measure_ID =" +
              Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Rubric_Measure_ID = result[0].Rubric_Measure_ID;
                let Class_Name = result[0].Class_Name;
                let Rubric_Name = result[0].Rubric_Name;

                if (isEmpty(Evaluator_Email)) {
                  errors.Evaluator_Email = "Evaluator email cannot be empty";
                  return res.status(404).json(errors);
                }

                if (!Validator.isEmail(Evaluator_Email)) {
                  errors.Evaluator_Email = "Evaluator email is not valid";
                  return res.status(404).json(errors);
                }

                sql =
                  "SELECT * FROM Evaluators WHERE Email = " +
                  db.escape(Evaluator_Email);
                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem removing the Evaluator"
                    });
                  }

                  if (result.length < 1) {
                    return res
                      .status(400)
                      .json({ error: "Evaluator not found" });
                  }
                  let Evaluator_Name = result[0].Fname + " " + result[0].Lname;
                  sql =
                    "SELECT * FROM RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
                    Rubric_Measure_ID +
                    " AND Evaluator_Email=" +
                    db.escape(Evaluator_Email);
                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem removing the Evaluator"
                      });
                    }

                    if (result.length > 0) {
                      sql =
                        "DELETE FROM RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID= " +
                        Rubric_Measure_ID +
                        " AND Evaluator_Email =" +
                        db.escape(Evaluator_Email);

                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error:
                              "There was some problem removing the evaluator"
                          });
                        } else {
                          updateStudentsScore(Rubric_Measure_ID, () => {});
                          message =
                            " have been removed from evaluation of the Rubric " +
                            Rubric_Name +
                            " in class " +
                            Class_Name +
                            ".";
                          sql =
                            "INSERT INTO ACTIVITY_LOG(From_Dept_ID,To_Email,Message) VALUES(" +
                            dept +
                            "," +
                            db.escape(Evaluator_Email) +
                            "," +
                            db.escape(message) +
                            ")";
                          // console.log(sql);
                          db.query(sql, (err, result) => {
                            if (err) {
                              return res.status(400).json({
                                error:
                                  "There was some problem removing  the evaluator"
                              });
                            }
                            return res.status(200).json({
                              // message: "Evaluator has successfully been assigned."
                              Evaluator_Email: req.body.Evaluator_Email,
                              Evaluator_Name: Evaluator_Name
                            });
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          } else {
            //for test

            sql = "SELECT * FROM TEST_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Test_Measure_ID = result[0].Test_Measure_ID;
                let Test_Name = result[0].Exam_Name;

                if (isEmpty(Evaluator_Email)) {
                  errors.Evaluator_Email = "Evaluator email cannot be empty";
                  return res.status(404).json(errors);
                }

                if (!Validator.isEmail(Evaluator_Email)) {
                  errors.Evaluator_Email = "Evaluator email is not valid";
                  return res.status(404).json(errors);
                }

                sql =
                  "SELECT * FROM Evaluators WHERE Email = " +
                  db.escape(Evaluator_Email);
                // console.log(sql);
                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem removing the Evaluator"
                    });
                  }

                  if (result.length < 1) {
                    return res
                      .status(400)
                      .json({ error: "Evaluator not found" });
                  }
                  let Evaluator_Name = result[0].Fname + " " + result[0].Lname;
                  sql =
                    "SELECT * FROM TEST_MEASURE_EVALUATOR WHERE Test_Measure_ID=" +
                    Test_Measure_ID +
                    " AND Evaluator_Email=" +
                    db.escape(Evaluator_Email);
                  // console.log(sql);
                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem removing the Evaluator"
                      });
                    }

                    if (result.length > 0) {
                      sql =
                        "DELETE FROM TEST_MEASURE_EVALUATOR WHERE Test_Measure_ID= " +
                        Test_Measure_ID +
                        " AND Evaluator_Email =" +
                        db.escape(Evaluator_Email);

                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error:
                              "There was some problem removing the evaluator"
                          });
                        } else {
                          message =
                            " have been removed from the evaluation of the test  " +
                            Test_Name +
                            ".";
                          sql =
                            "INSERT INTO ACTIVITY_LOG(From_Dept_ID,To_Email,Message) VALUES(" +
                            dept +
                            "," +
                            db.escape(Evaluator_Email) +
                            "," +
                            db.escape(message) +
                            ")";
                          // console.log(sql);
                          db.query(sql, (err, result) => {
                            if (err) {
                              return res.status(400).json({
                                error:
                                  "There was some problem removing the evaluator"
                              });
                            }
                            return res.status(200).json({
                              // message: "Evaluator has successfully been assigned."
                              Evaluator_Email: req.body.Evaluator_Email,
                              Evaluator_Name: Evaluator_Name
                            });
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID/addStudent
// @desc    Add a student to a Rubric Measure
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/addStudent",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Measure_ID = db.escape(req.params.measureID);
    const Outcome_ID = req.params.outcomeID;
    const Cycle_ID = req.params.cycleID;

    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT Measure_type FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE isSubmitted= 'false' AND Measure_ID = " +
        Measure_ID +
        " AND Outcome_ID=" +
        Outcome_ID +
        " AND Cycle_ID=" +
        Cycle_ID;
      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          if (result.length < 1) {
            errors.error = "Measure Not found Or the cycle is closed";
            return res.status(404).json(errors);
          }
          //for rubric Measure Type
          if (result[0].Measure_type == "rubric") {
            sql =
              "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Rubric_Measure_ID = result[0].Rubric_Measure_ID;

                Student_ID = req.body.Student_ID;
                Student_Name = req.body.Student_Name;

                if (isEmpty(Student_ID)) {
                  errors.Student_ID = "Evaluatee ID cannot be empty";
                }

                if (isEmpty(Student_Name)) {
                  errors.Student_Name = "Evaluatee Name cannot be empty";
                }

                if (!isEmpty(errors)) {
                  return res.status(404).json(errors);
                }

                sql =
                  "SELECT * FROM RUBRIC_STUDENTS WHERE RUBRIC_Measure_ID=" +
                  Rubric_Measure_ID +
                  " AND Student_ID=" +
                  db.escape(Student_ID);

                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem adding the Evaluatee"
                    });
                  }

                  if (result.length > 0) {
                    return res
                      .status(400)
                      .json({ error: "Evaluatee is already added" });
                  }
                  sql =
                    "INSERT INTO RUBRIC_STUDENTS (Rubric_Measure_ID, Student_ID, Student_Name, Student_Avg_Grade) VALUES(" +
                    Rubric_Measure_ID +
                    "," +
                    db.escape(Student_ID) +
                    "," +
                    db.escape(Student_Name) +
                    "," +
                    0 +
                    ")";

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem adding  the Evaluatee"
                      });
                    } else {
                      calculateMeasure(Rubric_Measure_ID);
                      return res.status(200).json({
                        Student_Name: Student_Name,
                        Student_ID: Student_ID
                      });
                    }
                  });
                });
              }
            });
          }
          //for test Measure
          else {
            sql = "SELECT * FROM TEST_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Test_Measure_ID = result[0].Test_Measure_ID;

                Student_ID = req.body.Student_ID;
                Student_Name = req.body.Student_Name;

                if (isEmpty(Student_ID)) {
                  errors.Student_ID = "Evaluatee ID cannot be empty";
                }

                if (isEmpty(Student_Name)) {
                  errors.Student_Name = "Evaluatee Name cannot be empty";
                }

                if (!isEmpty(errors)) {
                  return res.status(404).json(errors);
                }

                sql =
                  "SELECT * FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                  Test_Measure_ID +
                  " AND Student_ID=" +
                  db.escape(Student_ID);

                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem adding the Evaluatee"
                    });
                  }

                  if (result.length > 0) {
                    return res
                      .status(400)
                      .json({ error: "Evaluatee is already added" });
                  }
                  sql =
                    "INSERT INTO TEST_STUDENTS (Test_Measure_ID, Student_ID, Student_Name, Student_Avg_Grade) VALUES(" +
                    Test_Measure_ID +
                    "," +
                    db.escape(Student_ID) +
                    "," +
                    db.escape(Student_Name) +
                    "," +
                    0 +
                    ")";

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem adding  the Evaluatee"
                      });
                    } else {
                      calculateTestMeasure(Test_Measure_ID);
                      return res.status(200).json({
                        Student_Name: Student_Name,
                        Student_ID: Student_ID
                      });
                    }
                  });
                });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID/addStudent/fileUpload
// @desc    Add a student to a Rubric Measure using file upload
// @access  Private
router.post(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/addStudent/fileUpload",
  passport.authenticate("jwt", { session: false }),
  upload.single("students"),
  (req, res) => {
    const fileRows = [];

    // open uploaded file
    csv
      .fromPath(req.file.path)
      .on("data", function(data) {
        fileRows.push(data); // push each row
      })
      .on("end", function() {
        // console.log(fileRows); //contains array of arrays.
        fs.unlinkSync(req.file.path); // remove temp file
        //process "fileRows" and respond
        const email = db.escape(req.user.email);
        const type = req.user.type;
        const dept = db.escape(req.user.dept);
        const Measure_ID = db.escape(req.params.measureID);
        const Outcome_ID = req.params.outcomeID;
        const Cycle_ID = req.params.cycleID;

        const errors = {};
        if (type == "Admin") {
          let sql =
            "SELECT Measure_type FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE isSubmitted= 'false' AND Measure_ID = " +
            Measure_ID +
            " AND Outcome_ID=" +
            Outcome_ID +
            " AND Cycle_ID=" +
            Cycle_ID;

          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                errors.error = "Measure Not found or the cycle is closed";
                return res.status(404).json(errors);
              }
              //for rubric Measure Type
              if (result[0].Measure_type == "rubric") {
                sql =
                  "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" +
                  Measure_ID;

                // console.log(sql);
                db.query(sql, (err, result) => {
                  if (err) res.send(err);
                  else {
                    let Rubric_Measure_ID = result[0].Rubric_Measure_ID;

                    // Validation
                    let newCWID = [];
                    let newStudents = [];
                    let output = [];
                    fileRows.forEach(function(element) {
                      newStudents.push(
                        new Array(Rubric_Measure_ID, element[0], element[1], 0)
                      );
                      newCWID.push(element[0]);
                    });

                    if (new Set(newCWID).size !== newCWID.length) {
                      errors.students = "Duplicate Student ID in file";

                      return res.status(400).json(errors);
                    } else {
                      sql =
                        "SELECT Student_ID FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                        Rubric_Measure_ID;
                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json(err);
                        } else {
                          let regCWID = [];

                          result.forEach(row => {
                            let value = row.Student_ID;
                            regCWID.push(value);
                          });

                          //get the intersection and newCWID contains the duplicate values
                          let newArray = newCWID.filter(value =>
                            regCWID.includes(value)
                          );
                          console.log(newArray);

                          if (newArray.length > 0) {
                            return res.status(400).json(newArray);
                          } else {
                            sql =
                              "INSERT INTO RUBRIC_STUDENTS (Rubric_Measure_ID, Student_ID, Student_Name, Student_Avg_Grade) VALUES ?";

                            db.query(sql, [newStudents], (err, result) => {
                              if (err) {
                                errors.students =
                                  "There was some problem adding the evaluatees. Please check your csv file and try again.";
                                return res.status(400).json(errors);
                              } else {
                                calculateMeasure(Rubric_Measure_ID);
                                sql =
                                  "SELECT Student_ID, Student_Name FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID= " +
                                  Rubric_Measure_ID;

                                db.query(sql, (err, result) => {
                                  if (err) res.status(400).json(err);
                                  result.forEach(row => {
                                    student = {
                                      Student_ID: row.Student_ID,
                                      Student_Name: row.Student_Name
                                    };
                                    output.push(student);
                                  });
                                  return res.status(200).json(output);
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
              //for Test Measure
              else {
                sql =
                  "SELECT * FROM TEST_MEASURES WHERE Measure_ID =" + Measure_ID;

                // console.log(sql);
                db.query(sql, (err, result) => {
                  if (err) res.send(err);
                  else {
                    let Test_Measure_ID = result[0].Test_Measure_ID;

                    // Validation
                    let newCWID = [];
                    let newStudents = [];
                    let output = [];
                    fileRows.forEach(function(element) {
                      newStudents.push(
                        new Array(Test_Measure_ID, element[0], element[1], 0)
                      );
                      newCWID.push(element[0]);
                    });
                    // console.log(newStudents);
                    if (new Set(newCWID).size !== newCWID.length) {
                      errors.students = "Duplicate Student ID in file";

                      return res.status(400).json(errors);
                    } else {
                      sql =
                        "SELECT Student_ID FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                        Test_Measure_ID;
                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json(err);
                        } else {
                          let regCWID = [];

                          result.forEach(row => {
                            let value = row.Student_ID;
                            regCWID.push(value);
                          });

                          //get the intersection and newCWID contains the duplicate values
                          let newArray = newCWID.filter(value =>
                            regCWID.includes(value)
                          );
                          console.log(newArray);

                          if (newArray.length > 0) {
                            return res.status(400).json(newArray);
                          } else {
                            sql =
                              "INSERT INTO TEST_STUDENTS (Test_Measure_ID, Student_ID, Student_Name, Student_Avg_Grade) VALUES ?";

                            db.query(sql, [newStudents], (err, result) => {
                              if (err) {
                                errors.students =
                                  "There was some problem adding the evaluatees. Please check your csv file and try again.";
                                return res.status(400).json(errors);
                              } else {
                                calculateMeasure(Test_Measure_ID);
                                sql =
                                  "SELECT Student_ID, Student_Name FROM TEST_STUDENTS WHERE Test_Measure_ID= " +
                                  Test_Measure_ID;

                                db.query(sql, (err, result) => {
                                  if (err) res.status(400).json(err);
                                  result.forEach(row => {
                                    student = {
                                      Student_ID: row.Student_ID,
                                      Student_Name: row.Student_Name
                                    };
                                    output.push(student);
                                  });
                                  return res.status(200).json(output);
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
        } else {
          res.status(404).json({ error: "Not an Admin" });
        }
      });
  }
);

// @route   DELETE api/cycle/:cycleID/outcome/:outcomeID/measure/:MeasureID/removeStudent
// @desc    Add a student to a Rubric Measure
// @access  Private
router.delete(
  "/:cycleID/outcome/:outcomeID/measure/:measureID/removeStudent",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Measure_ID = db.escape(req.params.measureID);
    const Outcome_ID = req.params.outcomeID;
    const Cycle_ID = req.params.cycleID;

    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT Measure_type FROM MEASURES NATURAL JOIN OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE isSubmitted= 'false' AND Measure_ID = " +
        Measure_ID +
        " AND Outcome_ID=" +
        Outcome_ID +
        " AND Cycle_ID=" +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) return res.status(400).json(err);
        else {
          if (result.length < 1) {
            errors.error = "Measure Not found Or the cycle is closed.";
            return res.status(404).json(errors);
          }
          //for rubric Measure Type
          if (result[0].Measure_type == "rubric") {
            sql =
              "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Rubric_Measure_ID = result[0].Rubric_Measure_ID;

                Student_ID = req.body.Student_ID;

                if (isEmpty(Student_ID)) {
                  errors.Student_ID = "Evaluatee ID cannot be empty";
                }

                if (!isEmpty(errors)) {
                  return res.status(404).json(errors);
                }

                Student_ID = db.escape(Student_ID);

                sql =
                  "SELECT * FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                  Rubric_Measure_ID +
                  " AND Student_ID=" +
                  Student_ID;

                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem removing the Evaluatee"
                    });
                  }

                  if (result.length < 1) {
                    return res.status(400).json({ error: "Student not found" });
                  }

                  let Rubric_Student_ID = result[0].Rubric_Student_ID;

                  sql =
                    "DELETE FROM STUDENTS_RUBRIC_ROWS_GRADE WHERE Rubric_Student_ID=" +
                    Rubric_Student_ID;
                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem removing the Evaluatee"
                      });
                    } else {
                      sql =
                        "DELETE FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                        Rubric_Measure_ID +
                        " AND Student_ID=" +
                        Student_ID;

                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error: "There was some problem adding the Evaluatee"
                          });
                        } else {
                          updateStudentsScore(Rubric_Measure_ID, () => {});

                          Students = [];

                          sql =
                            "SELECT Student_ID, Student_Name FROM RUBRIC_STUDENTS NATURAL JOIN RUBRIC_MEASURES WHERE Rubric_Measure_ID= " +
                            Rubric_Measure_ID;

                          db.query(sql, (err, result) => {
                            if (err) res.status(400).json(err);
                            result.forEach(row => {
                              student = {
                                Student_ID: row.Student_ID,
                                Student_Name: row.Student_Name
                              };
                              Students.push(student);
                            });
                            return res.status(200).json(Students);
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          } else {
            sql = "SELECT * FROM TEST_MEASURES WHERE Measure_ID =" + Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) res.send(err);
              else {
                let Test_Measure_ID = result[0].Test_Measure_ID;

                Student_ID = req.body.Student_ID;

                if (isEmpty(Student_ID)) {
                  errors.Student_ID = "Evaluatee ID cannot be empty";
                }

                if (!isEmpty(errors)) {
                  return res.status(404).json(errors);
                }

                Student_ID = db.escape(Student_ID);

                sql =
                  "SELECT * FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                  Test_Measure_ID +
                  " AND Student_ID=" +
                  Student_ID;

                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "There was some problem removing the Evaluatee"
                    });
                  }

                  if (result.length < 1) {
                    return res.status(400).json({ error: "Student not found" });
                  }

                  let Test_Student_ID = result[0].Test_Student_ID;

                  sql =
                    "DELETE FROM STUDENTS_TEST_GRADE WHERE Test_Student_ID=" +
                    Test_Student_ID;
                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json({
                        error: "There was some problem removing the Evaluatee"
                      });
                    } else {
                      sql =
                        "DELETE FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                        Test_Measure_ID +
                        " AND Student_ID=" +
                        Student_ID;

                      db.query(sql, (err, result) => {
                        if (err) {
                          return res.status(400).json({
                            error: "There was some problem adding the Evaluatee"
                          });
                        } else {
                          updateStudentsTestScore(Test_Measure_ID, () => {});

                          Students = [];

                          sql =
                            "SELECT Student_ID, Student_Name FROM TEST_STUDENTS NATURAL JOIN TEST_MEASURES WHERE Test_Measure_ID= " +
                            Test_Measure_ID;

                          db.query(sql, (err, result) => {
                            if (err) res.status(400).json(err);
                            result.forEach(row => {
                              student = {
                                Student_ID: row.Student_ID,
                                Student_Name: row.Student_Name
                              };
                              Students.push(student);
                            });
                            return res.status(200).json(Students);
                          });
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

module.exports = router;
