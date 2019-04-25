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
              if (result.length < 1) {
                errors.Measure = "Measure is not defined yet";
                res.status(400).json(errors);
              } else {
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
                  "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE NATURAL JOIN RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
                  Rubric_Measure_ID +
                  " AND Rubric_ID=" +
                  Measure.Rubric_ID;

                db.query(sql, (err, result) => {
                  if (err) throw err;
                  else {
                    // console.log(sql);
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
                              "SELECT * FROM RUBRIC_STUDENTS S LEFT OUTER JOIN  STUDENTS_RUBRIC_ROWS_GRADE G ON S.Rubric_Student_ID = G.Rubric_Student_ID JOIN Evaluators E on E.Email=G.Evaluator_Email JOIN  RUBRIC_MEASURE_EVALUATOR EV ON EV.Evaluator_Email=G.Evaluator_Email AND EV.Rubric_Measure_ID=S.Rubric_Measure_ID WHERE S.Rubric_Measure_ID=" +
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

                                  Measure_Index = -1;
                                  sql =
                                    "SELECT Outcome_ID FROM MEASURES WHERE Measure_ID=" +
                                    Measure_ID;
                                  db.query(sql, (err, result) => {
                                    let Outcome_ID = result[0].Outcome_ID;

                                    sql =
                                      "SELECT * FROM MEASURES WHERE Outcome_ID=" +
                                      Outcome_ID +
                                      " ORDER BY Measure_Index";

                                    db.query(sql, (err, result) => {
                                      let found = false;
                                      let i = 0;

                                      while (i < result.length && !found) {
                                        if (
                                          result[i].Measure_ID == Measure_ID
                                        ) {
                                          found = true;
                                        }
                                        i++;
                                      }
                                      Measure_Index = i;

                                      Measure.Measure_Index = Measure_Index;
                                      return res.status(200).json(Measure);
                                    });
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
            });
          } else {
            // for test measure

            sql = " SELECT * FROM TEST_MEASURES WHERE Measure_ID=" + Measure_ID;
            db.query(sql, (err, result) => {
              if (err) return res.status(200).json(err);
              else {
                if (result.length < 1) {
                  errors.Measure = "Measure is not defined yet";
                  res.status(400).json(errors);
                }
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
                    Measure_Index = -1;
                    sql =
                      "SELECT Outcome_ID FROM MEASURES WHERE Measure_ID=" +
                      Measure_ID;
                    db.query(sql, (err, result) => {
                      let Outcome_ID = result[0].Outcome_ID;

                      sql =
                        "SELECT * FROM MEASURES WHERE Outcome_ID=" +
                        Outcome_ID +
                        " ORDER BY Measure_Index";

                      db.query(sql, (err, result) => {
                        let found = false;
                        let i = 0;

                        while (i < result.length && !found) {
                          if (result[i].Measure_ID == Measure_ID) {
                            found = true;
                          }

                          i++;
                        }

                        Measure_Index = i;

                        Measure.Measure_Index = Measure_Index;
                        return res.status(200).json(Measure);
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

// @route   GET api/reports/outcome/:outcomeID
// @desc    get the reports of a given measure
// @access  Private route
router.get(
  "/outcome/:outcomeID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      const Outcome_ID = req.params.outcomeID;
      const Outcome = {};
      let sql = "SELECT * FROM  OUTCOMES WHERE Outcome_ID =" + Outcome_ID;

      db.query(sql, (err, result) => {
        if (err) {
          errors.outcome = "There was error loading the evaluation";
          return res.status(400).json(errors);
        }
        if (result.length < 1) {
          errors.outcome = "Outcome does not exist";
          return res.status(404).json(errors);
        }

        Outcome.Outcome_ID = Outcome_ID;
        Outcome.Outcome_Name = result[0].Outcome_Name;
        Outcome.Class_Factors = result[0].Class_Factors;
        Outcome.Outcome_Success = result[0].Outcome_Success;

        let Outcome_Index = -1;
        let sql =
          "SELECT Cycle_ID FROM OUTCOMES WHERE Outcome_ID=" + Outcome_ID;

        db.query(sql, (err, result) => {
          if (result.length > 0) {
            let Cycle_ID = result[0].Cycle_ID;

            sql =
              "SELECT * FROM OUTCOMES WHERE Cycle_ID=" +
              Cycle_ID +
              " ORDER BY Outcome_Index";

            db.query(sql, (err, result) => {
              if (err) {
                errors.outcome = "There was error loading the evaluation";
                return res.status(400).json(errors);
              }
              let found = false;
              let i = 0;

              while (i < result.length && !found) {
                if (result[i].Outcome_ID == Outcome_ID) {
                  found = true;
                }
                i++;
              }
              Outcome.Outcome_Index = i;
              Outcome.Measures = [];

              sql =
                "SELECT * FROM MEASURES WHERE Outcome_ID=" +
                Outcome_ID +
                " ORDER BY Measure_Index";

              db.query(sql, (err, result) => {
                if (err) {
                  errors.outcome = "There was error loading the evaluation";
                  return res.status(400).json(errors);
                }

                let Measure_List = [];
                i = 0;
                while (i < result.length) {
                  Measure = {
                    Measure_Index: i + 1,
                    Measure_ID: result[i].Measure_ID
                  };
                  Measure_List.push(Measure);
                  i++;
                }
                createMeasureListReport(res, Outcome, Measure_List);
              });
            });
          }
        });
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

createMeasureListReport = (res, Outcome, Measure_List) => {
  errors = {};
  if (Measure_List.length < 1) {
    return res.status(200).json(Outcome);
  } else {
    Measure_ID = Measure_List[0].Measure_ID;
    Measure_Index = Measure_List[0].Measure_Index;

    sql = "SELECT * FROM  MEASURES WHERE Measure_ID=" + Measure_ID;

    db.query(sql, (err, result) => {
      if (err) {
        errors.outcome = "There was error loading the evaluation";
        return res.status(400).json(errors);
      }
      Measure = {};
      Measure.Measure_Name =
        Outcome.Outcome_Index +
        "." +
        Measure_Index +
        " " +
        result[0].Measure_label;
      Measure_Type = result[0].Measure_type;
      Measure.Measure_Result = "";

      if (Measure_Type == "rubric") {
        sql =
          "SELECT * FROM RUBRIC_MEASURES NATURAL JOIN RUBRIC WHERE Measure_ID=" +
          Measure_ID;

        db.query(sql, (err, result) => {
          if (err) {
            errors.outcome = "There was error loading the evaluation";
            return res.status(400).json(errors);
          }
          if (result.length > 0) {
            Rubric_Name = result[0].Rubric_Name;
            Rubric_Measure_ID = result[0].Rubric_Measure_ID;
            Achieved_Threshold = parseFloat(result[0].Score);
            Achieved_Threshold = Math.round(Achieved_Threshold * 100) / 100;
            Rubric_ID = result[0].Rubric_ID;
            Target = result[0].Target;

            sql =
              "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE NATURAL JOIN RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
              Rubric_Measure_ID +
              " AND Rubric_ID=" +
              Rubric_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) {
                errors.outcome = "There was error loading the evaluation";
                return res.status(400).json(errors);
              } else {
                const Total_Students = result[0].Total;

                //sql to find the count of students with required or better grade
                sql =
                  "SELECT Count(*) AS Success_Count FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                  Rubric_Measure_ID +
                  " AND Student_Avg_Grade>=" +
                  Target;

                db.query(sql, (err, result) => {
                  if (err) {
                    errors.outcome = "There was error loading the evaluation";
                    return res.status(400).json(errors);
                  } else {
                    const Success_Count = result[0].Success_Count;
                    Measure.Measure_Result =
                      "Result: " +
                      Achieved_Threshold +
                      "% (" +
                      Success_Count +
                      " out of " +
                      Total_Students +
                      ") of Students met the target criteria.";

                    Measure_List.shift();
                    Outcome.Measures.push(Measure);
                    createMeasureListReport(res, Outcome, Measure_List);
                  }
                });
              }
            });
          } else {
            Measure_List.shift();
            Outcome.Measures.push(Measure);
            createMeasureListReport(res, Outcome, Measure_List);
          }
        });
      } else {
        //for test
        sql = "SELECT * FROM TEST_MEASURES  WHERE Measure_ID=" + Measure_ID;

        db.query(sql, (err, result) => {
          if (err) {
            errors.outcome = "There was error loading the evaluation";
            return res.status(400).json(errors);
          }
          if (result.length > 0) {
            Test_Measure_ID = result[0].Test_Measure_ID;
            Achieved_Threshold = parseFloat(result[0].Score);
            Achieved_Threshold = Math.round(Achieved_Threshold * 100) / 100;
            Target = result[0].Target;

            sql =
              "SELECT DISTINCT(COUNT(*)) AS Total FROM STUDENTS_TEST_GRADE G NATURAL JOIN TEST_STUDENTS  S NATURAL JOIN TEST_MEASURE_EVALUATOR  WHERE G.Test_Measure_ID=" +
              Test_Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) {
                errors.outcome = "There was error loading the evaluation";
                return res.status(400).json(errors);
              } else {
                const Total_Students = result[0].Total;

                //sql to find the count of students with required or better grade
                sql =
                  "SELECT Count(*) AS Success_Count FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                  Test_Measure_ID +
                  " AND Student_Avg_Grade>=" +
                  Target;

                db.query(sql, (err, result) => {
                  if (err) {
                    errors.outcome = "There was error loading the report";
                    return res.status(400).json(errors);
                  } else {
                    const Success_Count = result[0].Success_Count;
                    Measure.Measure_Result =
                      "Result: " +
                      Achieved_Threshold +
                      "% (" +
                      Success_Count +
                      " out of " +
                      Total_Students +
                      ") of Students met the target criteria.";

                    Measure_List.shift();
                    Outcome.Measures.push(Measure);
                    createMeasureListReport(res, Outcome, Measure_List);
                  }
                });
              }
            });
          } else {
            Measure_List.shift();
            Outcome.Measures.push(Measure);
            createMeasureListReport(res, Outcome, Measure_List);
          }
        });
      }
    });
  }
};

// @route   GET api/reports/cycle/:cycleID
// @desc    get the reports of a given measure
// @access  Private route
router.get(
  "/cycle/:cycleID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      const Cycle_ID = req.params.cycleID;
      const Cycle = {};
      let sql = "SELECT * FROM  ASSESSMENT_CYCLE WHERE Cycle_ID =" + Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) {
          errors.cycle = "There was error loading the report";
          return res.status(400).json(errors);
        } else {
          if (result.length < 1) {
            errors.cycle = "Cycle does not exist";
            return res.status(404).json(errors);
          } else {
            Cycle.Cycle_Name = result[0].Cycle_Name;

            Cycle.Header = [
              "Outcome",
              "Measure",
              "Number of Evaluation",
              "Number Meeting Criteria",
              "Result"
            ];
            Cycle.Outcomes = [];
            Outcomes_List = [];
            sql =
              "SELECT * FROM OUTCOMES Where Cycle_ID=" +
              Cycle_ID +
              " ORDER  BY Outcome_Index";

            db.query(sql, (err, result) => {
              if (err) {
                errors.cycle = "There was error loading the report";
                return res.status(400).json(errors);
              } else {
                let i = 1;

                result.forEach(row => {
                  Outcome = {
                    Outcome_ID: row.Outcome_ID,
                    Outcome_Name: i + ". " + row.Outcome_Name,
                    Outcome_Index: i
                  };
                  Outcomes_List.push(Outcome);
                  i++;
                });

                OutcomeReport(res, Cycle, Outcomes_List);
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

OutcomeReport = (res, Cycle, Outcomes_List) => {
  errors = {};
  if (Outcomes_List.length == 0) {
    res.status(200).json(Cycle);
  } else {
    Outcome = Outcomes_List[0];
    Outcome_ID = Outcome.Outcome_ID;
    Outcome_Index = Outcome.Outcome_Index;
    Outcome.Data = [];

    sql =
      "SELECT * FROM MEASURES WHERE Outcome_ID=" +
      Outcome_ID +
      " ORDER BY Measure_Index";

    db.query(sql, (err, result) => {
      if (err) {
        errors.cycle = "There was error loading the report";
        return res.status(400).json(errors);
      }
      i = 1;
      Measure_List = [];

      result.forEach(row => {
        Is_Success = row.isSuccess;
        if (Is_Success == "true") {
          Is_Success = "Satisfied";
        } else {
          Is_Success = "Not Satisfied";
        }
        Measure = {
          Measure_ID: row.Measure_ID,
          Measure_Result: Is_Success,
          Measure_Index: Outcome_Index + "." + i,
          Measure_Type: row.Measure_type
        };
        Measure_List.push(Measure);
        i++;
      });
      MeasureReport(res, Cycle, Outcomes_List, Outcome, Measure_List);
    });
  }
};

MeasureReport = (res, Cycle, Outcomes_List, Outcome, Measure_List) => {
  errors = {};
  if (Measure_List.length == 0) {
    Outcomes_List.shift();
    if (Outcome.Data.length == 0) {
      row = ["-", "-", "-", "-", "-"];
      Outcome.Data.push(row);
    }

    Cycle.Outcomes.push(Outcome);
    OutcomeReport(res, Cycle, Outcomes_List);
  } else {
    Measure = Measure_List[0];
    Measure_Type = Measure.Measure_Type;

    if (Measure_Type == "rubric") {
      sql =
        "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID=" + Measure.Measure_ID;

      db.query(sql, (err, result) => {
        if (err) {
          errors.cycle = "There was error loading the report";
          return res.status(400).json(errors);
        } else {
          if (result.length < 1) {
            No_Of_Evaluations = 0;
            No_Met = 0;
            Percentage_Met = 0;

            row = [
              Measure.Measure_Index,
              No_Of_Evaluations,
              No_Met,
              Percentage_Met,
              Measure.Measure_Result
            ];
            Outcome.Data.push(row);
            Measure_List.shift();
            MeasureReport(res, Cycle, Outcomes_List, Outcome, Measure_List);
          } else {
            Percentage_Met = parseFloat(result[0].Score);
            Percentage_Met = Math.round(Percentage_Met * 100) / 100 + "%";

            Rubric_Measure_ID = result[0].Rubric_Measure_ID;
            Rubric_ID = result[0].Rubric_ID;
            Target = result[0].Target;

            sql =
              "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE NATURAL JOIN RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
              Rubric_Measure_ID +
              " AND Rubric_ID=" +
              Rubric_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) {
                errors.outcome = "There was error loading the evaluation";
                return res.status(400).json(errors);
              } else {
                let No_Of_Evaluations = result[0].Total;

                //sql to find the count of students with required or better grade
                sql =
                  "SELECT Count(*) AS Success_Count FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                  Rubric_Measure_ID +
                  " AND Student_Avg_Grade>=" +
                  Target;

                db.query(sql, (err, result) => {
                  if (err) {
                    errors.outcome = "There was error loading the evaluation";
                    return res.status(400).json(errors);
                  } else {
                    let No_Met = result[0].Success_Count;

                    row = [
                      Measure.Measure_Index,
                      No_Of_Evaluations,
                      No_Met,
                      Percentage_Met,
                      Measure.Measure_Result
                    ];
                    Outcome.Data.push(row);
                    Measure_List.shift();
                    MeasureReport(
                      res,
                      Cycle,
                      Outcomes_List,
                      Outcome,
                      Measure_List
                    );
                  }
                });
              }
            });
          }
        }
      });
    } else {
      //for test
      sql =
        "SELECT * FROM TEST_MEASURES WHERE Measure_ID=" + Measure.Measure_ID;

      db.query(sql, (err, result) => {
        if (err) {
          errors.cycle = "There was error loading the report";
          return res.status(400).json(errors);
        } else {
          if (result.length < 1) {
            No_Of_Evaluations = 0;
            No_Met = 0;
            Percentage_Met = 0;

            row = [
              Measure.Measure_Index,
              No_Of_Evaluations,
              No_Met,
              Percentage_Met,
              Measure.Measure_Result
            ];
            Outcome.Data.push(row);
            Measure_List.shift();
            MeasureReport(res, Cycle, Outcomes_List, Outcome, Measure_List);
          } else {
            Percentage_Met = parseFloat(result[0].Score);
            Percentage_Met = Math.round(Percentage_Met * 100) / 100 + "%";
            Test_Measure_ID = result[0].Test_Measure_ID;

            Target = result[0].Target;

            sql =
              "SELECT DISTINCT(COUNT(*)) AS Total FROM STUDENTS_TEST_GRADE G NATURAL JOIN TEST_STUDENTS  S NATURAL JOIN TEST_MEASURE_EVALUATOR  WHERE G.Test_Measure_ID=" +
              Test_Measure_ID;

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) {
                errors.outcome = "There was error loading the evaluation";
                return res.status(400).json(errors);
              } else {
                let No_Of_Evaluations = result[0].Total;

                //sql to find the count of students with required or better grade
                sql =
                  "SELECT Count(*) AS Success_Count FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                  Test_Measure_ID +
                  " AND Student_Avg_Grade>=" +
                  Target;

                db.query(sql, (err, result) => {
                  if (err) {
                    errors.outcome = "There was error loading the report";
                    return res.status(400).json(errors);
                  } else {
                    let No_Met = result[0].Success_Count;

                    row = [
                      Measure.Measure_Index,
                      No_Of_Evaluations,
                      No_Met,
                      Percentage_Met,
                      Measure.Measure_Result
                    ];
                    Outcome.Data.push(row);
                    Measure_List.shift();
                    MeasureReport(
                      res,
                      Cycle,
                      Outcomes_List,
                      Outcome,
                      Measure_List
                    );
                  }
                });
              }
            });
          }
        }
      });
    }
  }
};
module.exports = router;
