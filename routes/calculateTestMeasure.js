const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const passport = require("passport");
const secret = require("../config/secret");

const updateOutcome = require("./updateOutcome");

let calculateTestMeasure = Test_Measure_ID => {
  //sql to get the target and threshold
  sql =
    "SELECT  Target,Threshold FROM TEST_MEASURES WHERE Test_Measure_ID=" +
    Test_Measure_ID;

  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const Target = result[0].Target;
      const Threshold = result[0].Threshold;

      //sql to find total no of students evaluated
      sql =
        "SELECT DISTINCT(COUNT(*)) AS Total FROM STUDENTS_TEST_GRADE G NATURAL JOIN TEST_STUDENTS  S NATURAL JOIN TEST_MEASURE_EVALUATOR  WHERE G.Test_Measure_ID=" +
        Test_Measure_ID;

      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) throw err;
        else {
          const Total_Students = result[0].Total;

          //sql to find the count of students with required or better grade
          sql =
            "SELECT Count(*) AS Success_Count FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
            Test_Measure_ID +
            " AND Student_Avg_Grade>=" +
            Target;

          // console.log(sql);
          db.query(sql, (err, result) => {
            if (err) throw err;
            else {
              const Success_Count = result[0].Success_Count;

              let percent_success = (Success_Count / Total_Students) * 100;

              if (Total_Students == 0) {
                percent_success = 0;
              }
              let Measure_Success = db.escape("false");
              if (percent_success >= Threshold) {
                Measure_Success = db.escape("true");
              }

              //sql to update the percent of success and isSuccess for a Test Measure

              sql =
                "UPDATE TEST_MEASURES SET Score=" +
                percent_success +
                ", Is_Success=" +
                Measure_Success +
                " WHERE Test_Measure_ID=" +
                Test_Measure_ID;

              // console.log(Total_Students);

              // console.log(sql);
              db.query(sql, (err, result) => {
                if (err) throw err;

                sql =
                  "SELECT Measure_ID FROM TEST_MEASURES WHERE Test_Measure_ID=" +
                  Test_Measure_ID;
                db.query(sql, (err, result) => {
                  if (err) throw err;
                  let Measure_ID = result[0].Measure_ID;

                  sql =
                    "UPDATE MEASURES SET isSuccess=" +
                    Measure_Success +
                    " WHERE Measure_ID=" +
                    Measure_ID;
                  db.query(sql, (err, result) => {
                    if (err) throw err;
                    updateOutcome(Measure_ID);
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

module.exports = calculateTestMeasure;
