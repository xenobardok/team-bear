const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const passport = require("passport");
const secret = require("../config/secret");

let calculateMeasure = Rubric_Measure_ID => {
  //sql to get the target and threshold
  sql =
    "SELECT Target,Threshold FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
    Rubric_Measure_ID;

  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      const Target = result[0].Target;
      const Threshold = result[0].Threshold;

      //sql to find total no of students evaluated
      sql =
        "SELECT Count(*) AS Total FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
        Rubric_Measure_ID;

      db.query(sql, (err, result) => {
        if (err) throw err;
        else {
          const Total_Students = result[0].Total;

          //sql to find the count of students with required or better grade
          sql =
            "SELECT Count(*) AS Success_Count FROM RUBRIC_STUDENTS WHERE Rubric_Measure_ID=" +
            Rubric_Measure_ID +
            " AND Student_Avg_Grade>=" +
            Target;

          db.query(sql, (err, result) => {
            if (err) throw err;
            else {
              const Success_Count = result[0].Success_Count;

              const percent_success = (Success_Count / Total_Students) * 100;
              let Measure_Success = db.escape("false");
              if (percent_success >= Threshold) {
                Measure_Success = db.escape("true");
              }

              //sql to update the percent of success and isSuccess for a Rubric Measure

              sql =
                "UPDATE RUBRIC_MEASURES SET Score=" +
                percent_success +
                ", Is_Success=" +
                Measure_Success +
                " WHERE Rubric_Measure_ID=" +
                Rubric_Measure_ID;

              db.query(sql, (err, result) => {
                if (err) throw err;
              });
            }
          });
        }
      });
    }
  });
};

module.exports = calculateMeasure;
