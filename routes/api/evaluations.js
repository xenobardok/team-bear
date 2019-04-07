const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");

const updateStudentsScore = require("../updateStudentsScore");

// Loading Input Validation
const validateRubricInput = require("../../validation/rubric");

const calculateMeasure = require("../calculateMeasure");

// @route   GET api/evaluations/rubrics
// @desc    Returns the list of all the assigned rubrics
// @access  Private route
router.get(
  "/rubrics",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    Rubrics = [];
    let sql =
      "SELECT Rubric_Measure_ID, CONCAT(Class_Name,'  ',Rubric_Name) AS Rubric_Name  FROM RUBRIC_MEASURE_EVALUATOR NATURAL JOIN RUBRIC_MEASURES NATURAL JOIN RUBRIC WHERE Evaluator_Email =" +
      email;

    db.query(sql, (err, result) => {
      if (err)
        res.status(404).json({ error: "There was a problem loading it" });
      else {
        result.forEach(row => {
          id = row.Rubric_Measure_ID;
          name = row.Rubric_Name;

          rubric = {
            Rubric_Measure_ID: id,
            Rubric_Name: name
          };
          Rubrics.push(rubric);
        });
        return res.status(200).json(Rubrics);
      }
    });
  }
);

// @route   GET api/evaluations/rubrics/:RubricMeasureID
// @desc    Returns the details about an assigned Rubric from the Rubric_Measure_ID
// @access  Private route
router.get(
  "/rubricMeasure/:RubricMeasureID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = req.params.RubricMeasureID;
    const Rubric = {};

    let sql =
      "SELECT * FROM RUBRIC_MEASURE_EVALUATOR NATURAL JOIN RUBRIC_MEASURES NATURAL JOIN RUBRIC WHERE Evaluator_Email =" +
      email +
      " AND Rubric_Measure_ID =" +
      Rubric_Measure_ID;

    // console.log(sql);
    db.query(sql, (err, result) => {
      var Rubrics = {};
      if (err) throw err;
      else {
        if (result.length < 1) {
          return res.status(404).json({ error: "Rubric Not Found" });
        }
        Rubric.Rubric_ID = result[0].Rubric_ID;
        Rubric.Rubric_Name = result[0].Rubric_Name;
        Rubric.Rows_Num = result[0].Rows_Num;
        Rubric.Column_Num = result[0].Column_Num;
        Rubric.Scale = [];
        Rubric.Students = [];
        Rubric.data = [];

        sql =
          "SELECT * FROM RUBRIC NATURAL JOIN RUBRIC_SCALE WHERE Rubric_ID =" +
          Rubric.Rubric_ID +
          " ORDER BY Value ASC";

        db.query(sql, (err, result) => {
          if (err) return res.status(404).json(err);
          else {
            result.forEach(grade => {
              let aScale = {
                label: grade.Score_label,
                value: grade.Value
              };
              Rubric.Scale.push(aScale);
            });

            sql =
              "SELECT * FROM RUBRIC_STUDENTS NATURAL JOIN RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
              Rubric_Measure_ID;

            db.query(sql, (err, result) => {
              if (err) return res.status(400).json(err);
              else {
                result.forEach(student => {
                  let astudent = {
                    Student_ID: student.Student_ID,
                    Student_Name: student.Student_Name
                  };
                  Rubric.Students.push(astudent);
                });

                var newSql =
                  "SELECT * FROM RUBRIC_ROW WHERE Rubric_ID =" +
                  Rubric.Rubric_ID +
                  " ORDER BY Sort_Index";

                db.query(newSql, (err, result) => {
                  if (err) throw err;
                  else {
                    //let done = false;
                    let rowIndex = 0;
                    const totalRows = result.length;
                    result.forEach(row => {
                      var Rubric_Row_ID = row.Rubric_Row_ID;
                      var Sort_Index = row.Sort_Index;
                      var Measure_Factor = row.Measure_Factor;
                      var Column_values = [];
                      var newSql2 =
                        "SELECT * FROM COLUMNS WHERE Rubric_Row_ID =" +
                        Rubric_Row_ID +
                        " ORDER BY Column_No";

                      db.query(newSql2, (err, result) => {
                        if (err) return res.status(404).json(err);
                        else {
                          let columnIndex = 0;
                          const totalColumn = result.length;
                          result.forEach(row => {
                            var eachColumn = {
                              Column_ID: row.Columns_ID,
                              Column_No: row.Column_No,
                              value: row.Value
                            };
                            columnIndex++;
                            Column_values.push(eachColumn);
                          });

                          var eachRow = {
                            Rubric_Row_ID: Rubric_Row_ID,
                            Measure_Factor: Measure_Factor,
                            Column_values: Column_values
                          };
                          Rubric.data.push(eachRow);
                          rowIndex++;
                          if (
                            rowIndex == totalRows &&
                            columnIndex == totalColumn
                          ) {
                            return res.json(Rubric);
                          }
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
);

// @route   GET api/evaluations/rubricMeasure/:RubricMeasureID/student/:studentID
// @desc    Returns the grades of the student
// @access  Private route
router.get(
  "/rubricMeasure/:RubricMeasureID/student/:studentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Measure_ID = req.params.RubricMeasureID;
    const Student_ID = db.escape(req.params.studentID);

    const data = [];

    let sql =
      "SELECT DISTINCT * FROM RUBRIC_STUDENTS S NATURAL JOIN RUBRIC_MEASURES NATURAL JOIN  RUBRIC_ROW  R LEFT OUTER JOIN STUDENTS_RUBRIC_ROWS_GRADE G ON R.Rubric_Row_ID = G.Rubric_Row_ID AND S.Rubric_Student_ID = G.Rubric_Student_ID WHERE Rubric_Measure_ID=" +
      Rubric_Measure_ID +
      " AND Student_ID=" +
      Student_ID +
      " AND Evaluator_Email =" +
      email +
      " ORDER BY R.Rubric_Row_ID";

    // console.log(sql);
    db.query(sql, (err, result) => {
      if (err) throw err;
      else {
        result.forEach(row => {
          let score = row.Score;

          if (score == null) {
            score = 0;
          }

          data.push(score);
        });
        return res.status(200).json(data);
      }
    });
  }
);

// @route   POST api/evaluations/rubrics/:rubricID/student/:studentID
// @desc    Adds a grade to a student for a particular rubric
// @access  Private route
router.post(
  "/rubricMeasure/:rubricMeasureID/student/:studentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const score = req.body.Score;
    const Rubric_Measure_ID = db.escape(req.params.rubricMeasureID);
    const Student_ID = db.escape(req.params.studentID);

    // console.log(score);
    let sql =
      "SELECT DISTINCT Rubric_ID, Rubric_Student_ID FROM RUBRIC_STUDENTS NATURAL JOIN RUBRIC_MEASURES WHERE Student_ID = " +
      Student_ID +
      " AND Rubric_Measure_ID=" +
      Rubric_Measure_ID;

    db.query(sql, (err, result) => {
      if (err) return res.status(400).json(err);
      else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ error: "Rubric Measure Not Assigned to this Student" });
        }

        let Rubric_ID = result[0].Rubric_ID;
        let Rubric_Student_ID = db.escape(result[0].Rubric_Student_ID);

        sql =
          "SELECT DISTINCT Rubric_Row_ID FROM RUBRIC_ROW WHERE Rubric_ID=" +
          Rubric_ID +
          " ORDER BY Rubric_Row_ID";

        db.query(sql, (err, result) => {
          if (err) return res.status(400).json(err);
          else {
            Rubric_Row_ID = [];

            result.forEach(row => {
              Rubric_Row_ID.push(row.Rubric_Row_ID);
            });

            sql =
              "SELECT * FROM STUDENTS_RUBRIC_ROWS_GRADE WHERE Rubric_Student_ID=" +
              Rubric_Student_ID +
              " AND Evaluator_Email=" +
              db.escape(email);

            db.query(sql, (err, result) => {
              if (err) return res.status(400).json(err);

              //if data already exists, procceed with updating
              if (result.length > 0) {
                let done = false;
                let index = 0;
                sql = "";
                Rubric_Row_ID.forEach(row => {
                  sql +=
                    "UPDATE STUDENTS_RUBRIC_ROWS_GRADE SET Score=" +
                    score[index] +
                    " WHERE Rubric_Student_ID = " +
                    db.escape(Rubric_Student_ID) +
                    " AND Evaluator_Email=" +
                    db.escape(email) +
                    " AND Rubric_Row_ID=" +
                    row +
                    "; ";

                  index++;
                });

                //console.log(sql);
                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json(err);
                  } else {
                    // console.log(sql);
                    updateStudentsScore(Rubric_Measure_ID, () => {});
                    return res
                      .status(200)
                      .json({ message: "successfully updated" });
                  }
                });
              } else {
                //new insert

                sql =
                  "INSERT INTO STUDENTS_RUBRIC_ROWS_GRADE (Rubric_Student_ID,Evaluator_Email,Rubric_Row_ID,Score) VALUES ?";

                let sqlValues = [];
                index = 0;

                Rubric_Row_ID.forEach(row => {
                  value = [];

                  value.push(Rubric_Student_ID);

                  value.push(email);
                  value.push(row);
                  value.push(score[index]);

                  sqlValues.push(value);

                  index++;
                });

                db.query(sql, [sqlValues], (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    updateStudentsScore(Rubric_Measure_ID, () => {});
                    return res
                      .status(200)
                      .json({ message: "successfully updated" });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
);

module.exports = router;
