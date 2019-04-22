const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");
const validateCycleInput = require("../../validation/cycle");
const Validator = require("validator");
const fs = require("fs");
const csv = require("fast-csv");
const path = require("path");

const calculateMeasure = require("../calculateMeasure");
const updateStudentsScore = require("../updateStudentsScore");

const calculateTestMeasure = require("../calculateTestMeasure");
const updateStudentsTestScore = require("../updateStudentsTestScore");

const validateUpdateRubric = require("../../validation/rubricMeasure");
const validateUpdateTest = require("../../validation/testMeasure");

const isEmpty = require("../../validation/isEmpty");

// @route   GET api/reports/measure/:MeasureID
// @desc    get the reports of a given measure
// @access  Private route
router.get(
  "/measure/:measureID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      const Measure_ID = req.params.measureID;
      const Measure = {};
      let sql =
        "SELECT * FROM  MEASURES NATURAL JOIN OUTCOMES WHERE Measure_ID =" +
        Measure_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            errors.Measure = "Measure not found";
            return res.status(200).json(errors);
          }

          Measure.Measure_ID = Measure_ID;
          Measure.Measure_Label = result[0].Measure_label;
          Measure.Measure_Type = result[0].Measure_type;

          Measure.Outcome_Name = result[0].Outcome_Name;

          if (Measure.Measure_Type == "rubric") {
            sql =
              " SELECT * FROM RUBRIC_MEASURES NATURAL JOIN RUBRIC WHERE Measure_ID=" +
              Measure_ID;
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
                Measure.Rubric_Name = result[0].Rubric_Name;
                Measure.isWeighted = result[0].isWeighted;

                let No_Of_Rows = result[0].Rows_Num;

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

                        Measure.header = ["Evaluator"];

                        sql =
                          "SELECT * FROM RUBRIC_ROW WHERE Rubric_ID=" +
                          Measure.Rubric_ID +
                          " ORDER BY Rubric_Row_ID";

                        db.query(sql, (err, result) => {
                          if (err) {
                            return res.status(400).json(err);
                          } else {
                            result.forEach(RubricRow => {
                              Measure.header.push(RubricRow.Measure_Factor);
                            });
                            Measure.header.push("Overall Score");
                            sql =
                              "SELECT * FROM RUBRIC_STUDENTS S LEFT OUTER JOIN  STUDENTS_RUBRIC_ROWS_GRADE G ON S.Rubric_Student_ID = G.Rubric_Student_ID JOIN Evaluators E on E.Email=G.Evaluator_Email WHERE Rubric_Measure_ID=" +
                              Rubric_Measure_ID +
                              " ORDER BY S.Student_Name,G.Evaluator_Email,G.Rubric_Row_ID;";

                            db.query(sql, (err, result) => {
                              if (err) {
                                return res.status(400).json(err);
                              } else {
                                var myMap = new Map();

                                var i = 0;
                                var isDone = false;
                                while (i < result.length) {
                                  let Student_Name = result[i].Student_Name;
                                  let Student_ID = result[i].Student_ID;
                                  let rowValues = [];
                                  let Student_Avg_Grade =
                                    result[i].Student_Avg_Grade;
                                  let score = result[i].Score;
                                  let weightedScore = result[i].Weighted_Score;
                                  let Evaluator_Name =
                                    result[i].Fname + " " + result[i].Lname;
                                  rowValues.push(Evaluator_Name);
                                  let Total = 0;
                                  Total += weightedScore;

                                  if (Measure.isWeighted == "true") {
                                    rowValues.push(weightedScore);
                                  } else {
                                    rowValues.push(score);
                                  }

                                  for (j = 1; j < No_Of_Rows; j++) {
                                    i++;
                                    score = result[i].Score;
                                    weightedScore = result[i].Weighted_Score;
                                    Total += weightedScore;
                                    if (Measure.isWeighted == "true") {
                                      rowValues.push(weightedScore);
                                    } else {
                                      rowValues.push(score);
                                    }
                                  }
                                  rowValues.push(Total);

                                  if (myMap.has(Student_ID)) {
                                    student = myMap.get(Student_ID);

                                    student.data.push(rowValues);
                                    myMap.set(Student_ID, student);
                                  } else {
                                    row = {
                                      Student_Name: Student_Name,
                                      Average_Score: Student_Avg_Grade,
                                      data: [rowValues]
                                    };

                                    myMap.set(Student_ID, row);
                                  }
                                  //   console.log(rowValues);
                                  i++;
                                }

                                Measure.data = [];
                                if (i == result.length) {
                                  for (value of myMap.values()) {
                                    Measure.data.push(value);
                                  }

                                  return res.status(200).json(Measure);
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
            });
          } else {
            // for test measure

            sql = " SELECT * FROM TEST_MEASURES WHERE Measure_ID=" + Measure_ID;
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

                if (Measure.Test_Type == "pass/fail") {
                  if (Measure.Target == 0) {
                    Measure.Target = "Fail";
                  } else {
                    Measure.Target = "Pass";
                  }
                }

                calculateTestMeasure(Test_Measure_ID);

                Measure.data = [];

                sql =
                  "SELECT * FROM TEST_STUDENTS S JOIN TEST_MEASURES M ON S.Test_Measure_ID=M.Test_Measure_ID LEFT OUTER JOIN STUDENTS_TEST_GRADE G ON S.Test_Student_ID=G.Test_Student_ID WHERE M.Test_Measure_ID=" +
                  Test_Measure_ID +
                  " ORDER BY S.Student_Name ";

                // console.log(sql);
                db.query(sql, (err, result) => {
                  if (err) return res.status(400).json(err);
                  else {
                    result.forEach(student => {
                      let Student_ID = student.Student_ID;
                      let Student_Name = student.Student_Name;
                      let Grade = student.Score;

                      if (Grade != null) {
                        if (Measure.Test_Type == "pass/fail") {
                          if (Grade == 0) {
                            Grade = "Fail";
                          } else {
                            Grade = "Pass";
                          }
                        }

                        let astudent = {
                          Student_ID: Student_ID,
                          Student_Name: Student_Name,
                          Score: Grade
                        };
                        Measure.data.push(astudent);
                      }
                    });
                    res.status(200).json(Measure);
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

module.exports = router;
