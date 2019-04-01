const express = require("express");
const router = express.Router();
const db = require("../config/connection");
const passport = require("passport");
const secret = require("../config/secret");
const calculateMeasure = require("./calculateMeasure");

let updateStudentsScore = Rubric_Measure_ID => {
  console.log(Rubric_Measure_ID);

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
          "SELECT AVG(Score) AS Average FROM STUDENTS_RUBRIC_ROWS_GRADE G  JOIN RUBRIC_ROW R ON G.Rubric_Row_ID = R.Rubric_Row_ID RIGHT OUTER JOIN RUBRIC_STUDENTS S ON S.Rubric_Student_ID=G.Rubric_Student_ID WHERE S.Student_ID=" +
          db.escape(Student_ID) +
          " AND R.Rubric_ID=" +
          Rubric_ID;

        // console.log(sql);
        db.query(sql, (err, result) => {
          if (err) throw err;
          else {
            let Average_Student_Score = result[0].Average;

            if (Average_Student_Score == null) {
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
      calculateMeasure(Rubric_Measure_ID);
    }
  });
};

module.exports = updateStudentsScore;
