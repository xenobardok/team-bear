const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const passport = require("passport");
const secret = require("../config/secret");
const calculateMeasure = require("./calculateMeasure");
const updateOutcome = require("./updateOutcome");

async function updateStudentsTestScore(Test_Measure_ID, callback) {
  //   console.log(Test_Measure_ID);

  let sql =
    "SELECT * FROM TEST_STUDENTS NATURAL JOIN TEST_MEASURES  WHERE Test_Measure_ID =" +
    Test_Measure_ID;

  db.query(sql, (err, result) => {
    if (err) {
    } else {
      result.forEach(row => {
        let Test_Student_ID = row.Test_Student_ID;
        let Student_ID = row.Student_ID;

        let sql =
          "SELECT AVG(Score) AS Overall_Score FROM STUDENTS_TEST_GRADE G NATURAL JOIN TEST_STUDENTS S  JOIN TEST_MEASURE_EVALUATOR E ON E.Evaluator_Email=G.Evaluator_Email AND E.Test_Measure_ID = S.Test_Measure_ID WHERE S.Test_Student_ID=" +
          db.escape(Test_Student_ID) +
          " GROUP BY E.Evaluator_Email";

        // console.log(sql);
        db.query(sql, (err, result) => {
          if (err) {
          } else {
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
              "UPDATE TEST_STUDENTS SET Student_Avg_Grade=" +
              Average_Student_Score +
              " WHERE Test_Measure_ID =" +
              Test_Measure_ID +
              " AND Test_Student_ID=" +
              db.escape(Test_Student_ID);

            // console.log(sql);
            db.query(sql, (err, result) => {});
          }
        });
      });
      sql =
        "SELECT  Target,Threshold FROM TEST_MEASURES WHERE Test_Measure_ID=" +
        Test_Measure_ID;

      db.query(sql, (err, result) => {
        if (err) {
        } else {
          const Target = result[0].Target;
          const Threshold = result[0].Threshold;

          //sql to find total no of students evaluated
          sql =
            "SELECT Count(DISTINCT(Student_ID)) AS Total FROM  TEST_STUDENTS NATURAL JOIN STUDENTS_TEST_GRADE WHERE Test_Measure_ID=" +
            Test_Measure_ID;
          db.query(sql, (err, result) => {
            if (err) {
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

                  sql =
                    "SELECT * FROM TEST_MEASURE_EVALUATOR WHERE Test_Measure_ID=" +
                    Test_Measure_ID;

                  db.query(sql, (err, result) => {
                    let No_Of_Evaluators = result.length;

                    sql =
                      "SELECT * FROM TEST_STUDENTS WHERE Test_Measure_ID=" +
                      Test_Measure_ID;

                    db.query(sql, (err, result) => {
                      let No_Of_Students = result.length;

                      if (No_Of_Evaluators == 0 || No_Of_Students == 0) {
                        Measure_Success = db.escape("notStarted");
                      }

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
                        sql =
                          "SELECT Measure_ID FROM TEST_MEASURES WHERE Test_Measure_ID=" +
                          Test_Measure_ID;
                        db.query(sql, (err, result) => {
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
    }
  });
}

module.exports = updateStudentsTestScore;
