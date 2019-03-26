const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");
const validateCycleInput = require("../../validation/cycle");
const Validator = require("validator");

const validateUpdateRubric = require("../../validation/rubricMeasure");
// @route   GET api/cycle
// @desc    Gets the lists of all rubrics
// @access  Private

const isEmpty = require("../../validation/isEmpty");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;

    let sql =
      "SELECT * FROM ASSESSMENT_CYCLE WHERE Dept_ID = ('" +
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
      res.json(cycles);
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
                let Cycle_ID = db.escape(result.insertId);

                res.status(200).json((cycle = { Cycle_ID: Cycle_ID }));
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
              result.forEach(row => {
                outcome = {
                  Outcome_ID: row.Outcome_ID,
                  Outcome_Name: row.Outcome_Name,
                  Outcome_Index: row.Outcome_Index
                };

                Cycle.data.push(outcome);
              });

              return res.status(200).json(Cycle);
            }
          });
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
    console.log(req.body);
    let Outcome_Name = req.body.Outcome_Name;
    const errors = {};
    if (type == "Admin") {
      console.log(isEmpty(Outcome_Name));
      if (isEmpty(Outcome_Name)) {
        errors.Outcome_Name = "Outcome Name cannot be empty";
        return res.status(404).json(errors);
      }
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
            errors.Cycle_Name = "Outcome with that name already exists.";
            return res.status(404).json(errors);
          }

          sql =
            "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
            dept +
            " AND Cycle_ID=" +
            Cycle_ID;

          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              if (err) {
                return res.status(404).json(err);
              }
              let Outcome_Index = 0;
              if (result.length != 0) {
                Outcome_Index = result[result.length - 1].Outcome_Index + 1;
              }

              sql =
                "INSERT INTO OUTCOMES(Cycle_ID, Outcome_Name, Outcome_Index) VALUES(" +
                Cycle_ID +
                "," +
                Outcome_Name +
                "," +
                Outcome_Index +
                ")";

              db.query(sql, (err, result) => {
                if (err)
                  return res
                    .status(400)
                    .json({ error: "There was some problem adding it" });
                else {
                  let Outcome_ID = db.escape(result.insertId);

                  res.status(200).json((outcome = { Outcome_ID: Outcome_ID }));
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
    let Outcome_Name = req.body.Outcome_Name;
    let errors = {};

    if (type == "Admin") {
      if (isEmpty(Outcome_Name)) {
        return res
          .status(404)
          .json((errors = { Outcome_Name: "Outcome Name cannot be empty" }));
      }
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
          }

          sql =
            "UPDATE OUTCOMES SET Outcome_Name = " +
            Outcome_Name +
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
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   GET api/cycle/outcome/outcome:handle
// @desc    get the list of measures of a given cycle
// @access  Private route
router.get(
  "/outcome/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      const Outcome_ID = req.params.handle;
      const Outcome = {};

      let sql = "SELECT * FROM OUTCOMES WHERE Outcome_ID =" + Outcome_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Outcome_Name = "Outcome not found";
            return res.status(200).json(errors);
          }

          Outcome.Outcome_ID = Outcome_ID;
          Outcome.Cycle_ID = result[0].Cycle_ID;
          Outcome.data = [];
          sql =
            "SELECT * FROM MEASURES WHERE Outcome_ID= " +
            Outcome_ID +
            " ORDER BY Measure_Index";

          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              result.forEach(row => {
                measure = {
                  Measure_ID: row.Measure_ID,
                  Measure_Name: row.Measure_label,
                  Measure_Index: row.Measure_Index,
                  Measure_type: row.Measure_type
                };

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

// @route   POST api/cycle/outcome/:outcomeID/createRubricMeasure
// @desc    Create a new Rubric Measure
// @access  Private

router.post(
  "/outcome/:outcomeID/createRubricMeasure",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const outcomeID = db.escape(req.params.outcomeID);
    let Measure_Name = req.body.Measure_Name;
    const errors = {};
    if (type == "Admin") {
      //console.log(isEmpty(Outcome_Name));
      if (isEmpty(Measure_Name)) {
        return res
          .status(404)
          .json((errors.Measure_Name = "Measure Name cannot be empty"));
      }
      Measure_Name = db.escape(Measure_Name);
      let sql =
        "SELECT * FROM MEASURES WHERE Outcome_ID =" +
        outcomeID +
        " AND Measure_label=" +
        Measure_Name;
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length > 0) {
            errors.Measure_Name = "Measure Name with that name already exists.";
            return res.status(404).json(errors);
          }

          sql = "SELECT * FROM MEASURES WHERE Outcome_ID =" + outcomeID;
          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              let isSuccess = db.escape("false");
              let isCompleted = db.escape("false");
              let Measure_Index = 0;
              const Measure_type = db.escape("rubric");

              if (result.length != 0) {
                Measure_Index = result[result.length - 1].Measure_Index + 1;
              }

              sql =
                "INSERT INTO MEASURES(Measure_label,isSuccess, Outcome_ID,Measure_Index,Measure_type) VALUES(" +
                Measure_Name +
                "," +
                isSuccess +
                "," +
                outcomeID +
                "," +
                Measure_Index +
                "," +
                Measure_type +
                ")";

              db.query(sql, (err, result) => {
                if (err)
                  return res
                    .status(400)
                    .json({ error: "There was some problem adding it" });
                else {
                  let Measure_ID = db.escape(result.insertId);

                  sql =
                    "INSERT INTO RUBRIC_MEASURES(Measure_ID,Is_Success ) VALUES(" +
                    Measure_ID +
                    "," +
                    isSuccess +
                    ")";

                  db.query(sql, (err, result) => {
                    if (err)
                      return res
                        .status(400)
                        .json({ error: "There was some problem adding it" });
                    else {
                      Rubric_Measure_ID = db.escape(result.insertId);

                      Rubric_Measure = {
                        Measure_ID: Measure_ID,
                        Rubric_Measure_ID: Rubric_Measure_ID
                      };
                      return res.status(200).json(Rubric_Measure);
                    }
                  });
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

// @route   POST api/cycle/measures/:measureID/rubricMeasure/:rubricMeasureID/update
// @desc    Update a Rubric Measure
// @access  Private
router.post(
  "/measures/:measureID/rubricMeasure/:rubricMeasureID/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Measure_ID = db.escape(req.params.measureID);

    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" +
        Measure_ID +
        " AND Rubric_Measure_ID=" +
        Rubric_Measure_ID;

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Measure = "Rubric Measure could not be found";
            return res.status(404).json(errors);
          }

          //Threshold is %  of total students
          //Target is target score
          //Rubric_ID is the assigned Rubric ID
          //add date later

          const { errors, isValid } = validateUpdateRubric(req.body);

          if (!isValid) {
            return res.status(404).json(errors);
          }

          Threshold = req.body.Threshold;
          Target = req.body.Target;
          Rubric_ID = req.body.Rubric_ID;
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
              " WHERE Rubric_Measure_ID=" +
              Rubric_Measure_ID;

            console.log(sql);
            db.query(sql, (err, result) => {
              if (err) {
                return res
                  .status(400)
                  .json({ error: "There was some problem adding it" });
              } else {
                return res
                  .status(200)
                  .json({ message: "Rubric Measure was successfully updated" });
              }
            });
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/measures/:measureID/rubricMeasure/:rubricMeasureID/addEvaluator
// @desc    Add an evaluator to a Rubric Measure
// @access  Private
router.post(
  "/measures/:measureID/rubricMeasure/:rubricMeasureID/addEvaluator",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Measure_ID = db.escape(req.params.measureID);

    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" +
        Measure_ID +
        " AND Rubric_Measure_ID=" +
        Rubric_Measure_ID;

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Measure = "Rubric Measure could not be found";
            return res.status(404).json(errors);
          }

          Evaluator_Email = req.body.Evaluator_Email;

          if (isEmpty(Evaluator_Email)) {
            errors.Evaluator_Email = "Evaluator email cannot be empty";
            return res.status(404).json(errors);
          }
          console.log(Evaluator_Email);
          if (!Validator.isEmail(Evaluator_Email)) {
            errors.Evaluator_Email = "Evaluator email is not valid";
            return res.status(404).json(errors);
          }
          Evaluator_Email = db.escape(Evaluator_Email);

          sql = "SELECT * FROM Evaluators WHERE Email = " + Evaluator_Email;
          db.query(sql, (err, result) => {
            if (err) {
              return res
                .status(400)
                .json({ error: "There was some problem adding the Evaluator" });
            }

            if (result.length < 1) {
              return res.status(400).json({ error: "Evaluator not found" });
            }

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
                  return res.status(200).json({
                    message: "Evaluator has successfully been assigned."
                  });
                }
              });
            });
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/measures/:measureID/rubricMeasure/:rubricMeasureID/addStudent
// @desc    Add an evaluator to a Rubric Measure
// @access  Private
router.post(
  "/measures/:measureID/rubricMeasure/:rubricMeasureID/addStudent",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Measure_ID = db.escape(req.params.measureID);

    const errors = {};
    if (type == "Admin") {
      let sql =
        "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID =" +
        Measure_ID +
        " AND Rubric_Measure_ID=" +
        Rubric_Measure_ID;

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Measure = "Rubric Measure could not be found";
            return res.status(404).json(errors);
          }

          Student_ID = db.escape(req.body.Student_ID);
          Student_Name = req.body.Student_Name;

          if (isEmpty(Student_ID)) {
            errors.Student_Email = "Evaluatee ID cannot be empty";
          }

          if (isEmpty(Student_Name)) {
            errors.Student_Name = "Evaluatee Name cannot be empty";
          }

          if (!isEmpty(errors)) {
            return res.status(404).json(errors);
          }

          Student_ID = db.escape(Student_ID);
          Student_Name = db.escape(Student_Name);

          sql =
            "SELECT * FROM RUBRIC_STUDENTS WHERE RUBRIC_Measure_ID=" +
            Rubric_Measure_ID +
            " AND Student_ID=" +
            Student_ID;

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
              Student_ID +
              "," +
              Student_Name +
              "," +
              0 +
              ")";

            db.query(sql, (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "There was some problem adding  the Evaluatee"
                });
              } else {
                return res
                  .status(200)
                  .json({ message: "Evaluatee has successfully been added" });
              }
            });
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

module.exports = router;
