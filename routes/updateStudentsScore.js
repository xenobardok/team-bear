const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const passport = require("passport");
const secret = require("../config/secret");
const calculateMeasure = require("./calculateMeasure");

var async = require("async");

async function updateStudentsScore(Rubric_Measure_ID, callback) {
  // console.log(Rubric_Measure_ID);

  let sql =
    "SELECT * FROM RUBRIC_STUDENTS NATURAL JOIN RUBRIC_MEASURES  WHERE Rubric_Measure_ID =" +
    Rubric_Measure_ID;

  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      result.forEach(row => {
        let Student_ID = row.Student_ID;
        let Rubric_ID = result[0].Rubric_ID;

        let sql =
          "SELECT SUM(Weighted_Score) AS Overall_Score FROM STUDENTS_RUBRIC_ROWS_GRADE G  JOIN RUBRIC_ROW R ON G.Rubric_Row_ID = R.Rubric_Row_ID  RIGHT OUTER JOIN RUBRIC_STUDENTS S ON S.Rubric_Student_ID=G.Rubric_Student_ID JOIN RUBRIC_MEASURE_EVALUATOR E ON E.Evaluator_Email=G.Evaluator_Email AND E.Rubric_Measure_ID = S.Rubric_Measure_ID WHERE S.Student_ID=" +
          db.escape(Student_ID) +
          " AND R.Rubric_ID=" +
          Rubric_ID +
          " GROUP BY G.Evaluator_Email";

        // console.log(sql);
        db.query(sql, (err, result) => {
          if (err) throw err;
          else {
            let Total_Score = 0;
            let Count = 0;

            result.forEach(row => {
              Total_Score += row.Overall_Score;
              Count += 1;
            });

            let Average_Student_Score = Total_Score / Count;

            if (Total_Score == 0) {
              Average_Student_Score = 0;
            }
            //sql to get average score of a measure
            sql =
              "UPDATE RUBRIC_STUDENTS SET Student_Avg_Grade=" +
              Average_Student_Score +
              " WHERE Rubric_Measure_ID =" +
              Rubric_Measure_ID +
              " AND Student_ID=" +
              db.escape(Student_ID);

            // console.log(sql);
            db.query(sql, (err, result) => {
              if (err) throw err;
            });
          }
        });
      });
      sql =
        "SELECT Rubric_ID, Target,Threshold FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
        Rubric_Measure_ID;

      db.query(sql, (err, result) => {
        if (err) throw err;
        else {
          const Rubric_ID = result[0].Rubric_ID;
          const Target = result[0].Target;
          const Threshold = result[0].Threshold;

          //sql to find total no of students evaluated
          sql =
            "SELECT Count(DISTINCT(Student_ID)) AS Total FROM team_bear.RUBRIC NATURAL JOIN RUBRIC_ROW NATURAL JOIN RUBRIC_STUDENTS NATURAL JOIN STUDENTS_RUBRIC_ROWS_GRADE WHERE Rubric_Measure_ID=" +
            Rubric_Measure_ID +
            " AND Rubric_ID=" +
            Rubric_ID;
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

                  let percent_success = (Success_Count / Total_Students) * 100;

                  if (Total_Students == 0) {
                    percent_success = 0;
                  }
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

                    callback();
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

module.exports = updateStudentsScore;
