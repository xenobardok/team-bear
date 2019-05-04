const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const passport = require("passport");
const secret = require("../config/secret");

const updateOutcome = require("./updateOutcome");

let calculateMeasure = Rubric_Measure_ID => {
  //sql to get the target and threshold
  sql =
    "SELECT Rubric_ID, Target,Threshold FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
    Rubric_Measure_ID;

  db.query(sql, (err, result) => {
    if (err) {
    } else {
      const Rubric_ID = result[0].Rubric_ID;
      const Target = result[0].Target;
      const Threshold = result[0].Threshold;

      //sql to find total no of students evaluated
      sql =
        "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE NATURAL JOIN RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
        Rubric_Measure_ID +
        " AND Rubric_ID=" +
        Rubric_ID;

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
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
            } else {
              const Success_Count = result[0].Success_Count;

              let percent_success = (Success_Count / Total_Students) * 100;

              if (Total_Students == 0) {
                percent_success = 0;
              }
              let Measure_Success = db.escape("false");
              if (percent_success >= Threshold) {
                Measure_Success = db.escape("true");
              }

              if (Total_Students == 0) {
                Measure_Success = db.escape("pending");
              }

              //sql to update the percent of success and isSuccess for a Rubric Measure

              sql =
                "SELECT * FROM RUBRIC_MEASURE_EVALUATOR WHERE Rubric_Measure_ID=" +
                Rubric_Measure_ID;

              db.query(sql, (err, result) => {
                let No_Of_Evaluators = result.length;

                sql =
                  "SELECT * FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
                  Rubric_Measure_ID;

                db.query(sql, (err, result) => {
                  let No_Of_Students = result.length;

                  if (No_Of_Evaluators == 0 || No_Of_Students == 0) {
                    Measure_Success = db.escape("notStarted");
                  }
                  sql =
                    "UPDATE RUBRIC_MEASURES SET Score=" +
                    percent_success +
                    ", Is_Success=" +
                    Measure_Success +
                    " WHERE Rubric_Measure_ID=" +
                    Rubric_Measure_ID;

                  // console.log(sql);
                  db.query(sql, (err, result) => {
                    sql =
                      "SELECT Measure_ID FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
                      Rubric_Measure_ID;
                    db.query(sql, (err, result) => {
                      if (err) {
                      }
                      let Measure_ID = result[0].Measure_ID;

                      sql =
                        "UPDATE MEASURES SET isSuccess=" +
                        Measure_Success +
                        " WHERE Measure_ID=" +
                        Measure_ID;
                      db.query(sql, (err, result) => {
                        updateOutcome(Measure_ID);
                      });
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
};

module.exports = calculateMeasure;
