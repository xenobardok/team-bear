const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");
const Validator = require("validator");

const updateStudentsScore = require("../updateStudentsScore");
const updateStudentsTestScore = require("../updateStudentsTestScore");

// Loading Input Validation
const validateRubricInput = require("../../validation/rubric");

const calculateMeasure = require("../calculateMeasure");

const isEmpty = require("../../validation/isEmpty");

const oldToNewRubricMap = new Map();

let done = false;

router.post(
  "/cycle/:cycleID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Old_Cycle_ID = req.params.cycleID;
    let errors = {};

    if (type == "Admin") {
      let sql =
        " SELECT * FROM ASSESSMENT_CYCLE  WHERE Cycle_ID=" +
        Old_Cycle_ID +
        " AND Dept_ID=" +
        dept;

      db.query(sql, (err, result) => {
        if (err) {
          {
            return res
              .status(400)
              .json({ error: "Something went wrong. Please try again." });
          }
        } else {
          if (result.length < 1) {
            errors.cycleID = "Cycle not found";
            {
              return res
                .status(400)
                .json({ error: "Something went wrong. Please try again." });
            }
          } else {
            let Cycle_Name = result[0].Cycle_Name;
            let False = "false";
            sql =
              "INSERT INTO ASSESSMENT_CYCLE (Cycle_Name,Dept_ID,isSubmitted) VALUES(" +
              db.escape(Cycle_Name) +
              "," +
              dept +
              "," +
              db.escape(False) +
              ")";

            db.query(sql, (err, result) => {
              if (err) {
                {
                  return res
                    .status(400)
                    .json({ error: "Something went wrong. Please try again." });
                }
              } else {
                let New_Cycle_ID = result.insertId;
                console.log(New_Cycle_ID);
                console.log(result);

                let Outcome_List = [];
                sql =
                  "SELECT Outcome_ID From OUTCOMES WHERE Cycle_ID=" +
                  Old_Cycle_ID +
                  " ORDER BY Outcome_Index";

                db.query(sql, (err, result) => {
                  if (err) {
                    {
                      return res.status(400).json({
                        error: "Something went wrong. Please try again."
                      });
                    }
                  } else {
                    result.forEach(row => {
                      Outcome_List.push(row.Outcome_ID);
                    });
                    // console.log(New_Cycle_ID);
                    duplicateOutcomes(res, New_Cycle_ID, Outcome_List);
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

duplicateOutcomes = (res, New_Cycle_ID, Outcome_List) => {
  if (Outcome_List.length > 0) {
    Old_Outcome_ID = Outcome_List[0];

    let sql = "SELECT * FROM OUTCOMES WHERE Outcome_ID=" + Old_Outcome_ID;
    db.query(sql, (err, result) => {
      if (err) {
        {
          return res
            .status(400)
            .json({ error: "Something went wrong. Please try again." });
        }
      } else {
        let Outcome_Name = result[0].Outcome_Name;
        let Outcome_index = result[0].Outcome_Index;
        // console.log(Outcome_Name);
        // console.log(New_Cycle_ID);
        sql =
          "INSERT INTO OUTCOMES (Outcome_Name,Outcome_Index,Cycle_ID) VALUES(" +
          db.escape(Outcome_Name) +
          "," +
          Outcome_index +
          "," +
          New_Cycle_ID +
          ")";
        // console.log(sql);
        db.query(sql, (err, result) => {
          if (err) {
            {
              return res
                .status(400)
                .json({ error: "Something went wrong. Please try again." });
            }
          } else {
            let New_Outcome_ID = result.insertId;
            let Measure_List = [];

            sql =
              "SELECT Measure_ID From MEASURES WHERE Outcome_ID=" +
              Old_Outcome_ID +
              " ORDER BY Measure_Index";

            db.query(sql, (err, result) => {
              if (err) {
                {
                  return res
                    .status(400)
                    .json({ error: "Something went wrong. Please try again." });
                }
              } else {
                result.forEach(row => {
                  Measure_List.push(row.Measure_ID);
                });
                duplicateMeasures(
                  res,
                  New_Cycle_ID,
                  Outcome_List,
                  New_Outcome_ID,
                  Measure_List
                );
              }
            });
          }
        });
      }
    });
  } else {
    return res.status(200).json({ message: "Successfully migrated" });
  }
};

duplicateMeasures = (
  res,
  New_Cycle_ID,
  Outcome_List,
  New_Outcome_ID,
  Measure_List
) => {
  if (Measure_List.length > 0) {
    Old_Measure_ID = Measure_List[0];

    let sql = "SELECT * FROM MEASURES WHERE Measure_ID=" + Old_Measure_ID;
    db.query(sql, (err, result) => {
      if (err) {
        {
          return res
            .status(400)
            .json({ error: "Something went wrong. Please try again." });
        }
      } else {
        let Measure_label = result[0].Measure_label;
        let Measure_Index = result[0].Measure_Index;
        let Measure_Type = result[0].Measure_type;

        sql =
          "INSERT INTO MEASURES (Measure_label,Measure_Index,Measure_Type,Outcome_ID) VALUES(" +
          db.escape(Measure_label) +
          "," +
          Measure_Index +
          "," +
          db.escape(Measure_Type) +
          "," +
          New_Outcome_ID +
          ")";
        db.query(sql, (err, result) => {
          if (err) {
            {
              return res
                .status(400)
                .json({ error: "Something went wrong. Please try again." });
            }
          } else {
            let New_Measure_ID = result.insertId;

            if (Measure_Type == "rubric") {
              sql =
                "SELECT * FROM RUBRIC_MEASURES WHERE Measure_ID=" +
                Old_Measure_ID;
              db.query(sql, (err, result) => {
                if (err) {
                  {
                    return res.status(400).json({
                      error: "Something went wrong. Please try again."
                    });
                  }
                } else {
                  let Rubric_Measure_ID = result[0].Rubric_Measure_ID;
                  duplicateRubricMeasure(
                    res,
                    New_Cycle_ID,
                    Outcome_List,
                    New_Outcome_ID,
                    Measure_List,
                    New_Measure_ID,
                    Rubric_Measure_ID
                  );
                }
              });
            } else {
              sql =
                "SELECT * FROM TEST_MEASURES WHERE Measure_ID=" +
                Old_Measure_ID;
              db.query(sql, (err, result) => {
                if (err) {
                  {
                    return res.status(400).json({
                      error: "Something went wrong. Please try again."
                    });
                  }
                } else {
                  let Test_Measure_ID = result[0].Test_Measure_ID;
                  duplicateTestMeasure(
                    res,
                    New_Cycle_ID,
                    Outcome_List,
                    New_Outcome_ID,
                    Measure_List,
                    New_Measure_ID,
                    Test_Measure_ID
                  );
                }
              });
            }
          }
        });
      }
    });
  } else {
    Outcome_List.shift();
    duplicateOutcomes(res, New_Cycle_ID, Outcome_List);
  }
};

duplicateTestMeasure = (
  res,
  New_Cycle_ID,
  Outcome_List,
  New_Outcome_ID,
  Measure_List,
  New_Measure_ID,
  Test_Measure_ID
) => {
  let sql =
    "SELECT * FROM TEST_MEASURES WHERE Test_Measure_ID=" + Test_Measure_ID;

  db.query(sql, (err, result) => {
    if (err) {
      {
        return res
          .status(400)
          .json({ error: "Something went wrong. Please try again." });
      }
    } else {
      let Exam_Name = result[0].Exam_Name;
      let Target = result[0].Target;
      let Threshold = result[0].Threshold;
      let Score = 0;
      let Is_Success = "false";
      let Test_Type = result[0].Test_Type;

      sql =
        "INSERT INTO TEST_MEASURES (Exam_Name,Measure_ID,Target,Threshold,Score,Is_Success,Test_Type) VALUES(" +
        db.escape(Exam_Name) +
        "," +
        New_Measure_ID +
        "," +
        Target +
        "," +
        Threshold +
        "," +
        Score +
        "," +
        db.escape(Is_Success) +
        "," +
        db.escape(Test_Type) +
        ")";
      db.query(sql, (err, result) => {
        if (err) {
          {
            return res
              .status(400)
              .json({ error: "Something went wrong. Please try again." });
          }
        } else {
          Measure_List.shift();
          duplicateMeasures(
            res,
            New_Cycle_ID,
            Outcome_List,
            New_Outcome_ID,
            Measure_List
          );
        }
      });
    }
  });
};

duplicateRubricMeasure = (
  res,
  New_Cycle_ID,
  Outcome_List,
  New_Outcome_ID,
  Measure_List,
  New_Measure_ID,
  Rubric_Measure_ID
) => {
  let sql =
    "SELECT * FROM RUBRIC_MEASURES WHERE Rubric_Measure_ID=" +
    Rubric_Measure_ID;
  db.query(sql, (err, result) => {
    if (err) {
      {
        return res
          .status(400)
          .json({ error: "Something went wrong. Please try again." });
      }
    } else {
      let Class_Name = result[0].Class_Name;
      let Target = result[0].Target;
      let Threshold = result[0].Threshold;
      let Score = 0;
      let Is_Success = "false";
      let Old_Rubric_ID = result[0].Rubric_ID;

      sql =
        "INSERT INTO RUBRIC_MEASURES (Class_Name,Measure_ID,Target,Threshold,Score,Is_Success) VALUES(" +
        db.escape(Class_Name) +
        "," +
        New_Measure_ID +
        "," +
        Target +
        "," +
        Threshold +
        "," +
        Score +
        "," +
        db.escape(Is_Success) +
        ")";

      db.query(sql, (err, result) => {
        if (err) {
          {
            return res
              .status(400)
              .json({ error: "Something went wrong. Please try again." });
          }
        } else {
          let New_Rubric_Measure_ID = result.insertId;
          if (Old_Rubric_ID == null) {
            Measure_List.shift();
            duplicateMeasures(
              res,
              New_Cycle_ID,
              Outcome_List,
              New_Outcome_ID,
              Measure_List
            );
          } else if (oldToNewRubricMap.has(Old_Rubric_ID)) {
            let New_Rubric_ID = oldToNewRubricMap.get(Old_Rubric_ID);

            sql =
              "UPDATE RUBRIC_MEASURES SET Rubric_ID=" +
              New_Rubric_ID +
              " WHERE Rubric_Measure_ID=" +
              New_Rubric_Measure_ID;
            db.query(sql, (err, result) => {
              if (err) {
                {
                  return res
                    .status(400)
                    .json({ error: "Something went wrong. Please try again." });
                }
              } else {
                Measure_List.shift();
                duplicateMeasures(
                  res,
                  New_Cycle_ID,
                  Outcome_List,
                  New_Outcome_ID,
                  Measure_List
                );
              }
            });
          } else {
            duplicateRubric(
              res,
              New_Cycle_ID,
              Outcome_List,
              New_Outcome_ID,
              Measure_List,
              New_Measure_ID,
              Rubric_Measure_ID,
              New_Rubric_Measure_ID,
              Old_Rubric_ID
            );
          }
        }
      });
    }
  });
};

duplicateRubric = (
  res,
  New_Cycle_ID,
  Outcome_List,
  New_Outcome_ID,
  Measure_List,
  New_Measure_ID,
  Rubric_Measure_ID,
  New_Rubric_Measure_ID,
  Old_Rubric_ID
) => {
  let sql = "SELECT * FROM RUBRIC Where Rubric_ID=" + Old_Rubric_ID;
  db.query(sql, (err, result) => {
    if (err) {
      {
        return res
          .status(400)
          .json({ error: "Something went wrong. Please try again." });
      }
    } else {
      //   console.log(sql);

      let Rubric_Name = result[0].Rubric_Name;
      let Rows_Num = result[0].Rows_Num;
      let Column_Num = result[0].Column_Num;
      let ScaleSize = result[0].Scale;
      let Dept_ID = result[0].Dept_ID;
      let isVisible = true;
      let isWeighted = result[0].isWeighted;

      sql =
        "INSERT INTO RUBRIC(Rubric_Name, Rows_Num, Column_Num,Scale,Dept_ID,isWeighted,isVisible) VALUES(" +
        db.escape(Rubric_Name) +
        "," +
        Rows_Num +
        "," +
        Column_Num +
        "," +
        ScaleSize +
        "," +
        db.escape(Dept_ID) +
        "," +
        db.escape(isWeighted) +
        "," +
        db.escape(isVisible) +
        ")";
      //console.log(sql);

      // CREATE RUBRIC_ROW TABLE WITH Rows_Num and Column_Num
      db.query(sql, (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "Something went wrong. Please try again." });
        } else {
          let Rubric_ID = db.escape(result.insertId);
          oldToNewRubricMap.set(Old_Rubric_ID, Rubric_ID);

          sql =
            " UPDATE RUBRIC_MEASURES SET Rubric_ID=" +
            Rubric_ID +
            " WHERE Rubric_Measure_ID=" +
            New_Rubric_Measure_ID;

          db.query(sql, (err, result) => {
            if (err) {
              {
                return res
                  .status(400)
                  .json({ error: "Something went wrong. Please try again." });
              }
            } else {
              sql =
                "SELECT * FROM RUBRIC_SCALE WHERE Rubric_ID=" + Old_Rubric_ID;
              db.query(sql, (err, result) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ error: "Something went wrong. Please try again." });
                } else {
                  let scaleSql = "";

                  result.forEach(row => {
                    scaleSql +=
                      " INSERT INTO RUBRIC_SCALE (Rubric_ID,Score_label,Value) VALUES(" +
                      Rubric_ID +
                      "," +
                      db.escape(row.Score_label) +
                      "," +
                      db.escape(row.Value) +
                      "); ";
                  });

                  db.query(scaleSql, (err, result) => {
                    if (err)
                      return res
                        .status(400)
                        .json({ error: "There was some problem adding it" });
                    else {
                      sql =
                        "SELECT * FROM RUBRIC_ROW WHERE Rubric_ID=" +
                        Old_Rubric_ID +
                        " ORDER BY Sort_Index";

                      db.query(sql, (err, result) => {
                        if (err)
                          return res.status(400).json({
                            error: "There was some problem adding it"
                          });
                        else {
                          let RowsList = [];

                          result.forEach(row => {
                            RowsList.push(row.Rubric_Row_ID);
                          });

                          duplicateRows(
                            res,
                            New_Cycle_ID,
                            Outcome_List,
                            New_Outcome_ID,
                            Measure_List,
                            New_Measure_ID,
                            Rubric_Measure_ID,
                            New_Rubric_Measure_ID,
                            Old_Rubric_ID,
                            Rubric_ID,
                            RowsList
                          );
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
    }
  });
};

duplicateRows = (
  res,
  New_Cycle_ID,
  Outcome_List,
  New_Outcome_ID,
  Measure_List,
  New_Measure_ID,
  Rubric_Measure_ID,
  New_Rubric_Measure_ID,
  Old_Rubric_ID,
  Rubric_ID,
  RowsList
) => {
  if (RowsList.length > 0) {
    let Old_Rubric_Row_ID = RowsList[0];
    let sql =
      "SELECT * FROM RUBRIC_ROW WHERE Rubric_Row_ID=" + Old_Rubric_Row_ID;

    db.query(sql, (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Something went wrong. Please try again." });
      } else {
        let Measure_Factor = result[0].Measure_Factor;
        let Sort_Index = result[0].Sort_Index;
        let Rubric_Row_Weight = result[0].Rubric_Row_Weight;

        sql =
          "INSERT INTO RUBRIC_ROW (Rubric_ID,Measure_Factor,Sort_Index,Rubric_Row_Weight) VALUES(" +
          Rubric_ID +
          "," +
          db.escape(Measure_Factor) +
          "," +
          Sort_Index +
          "," +
          Rubric_Row_Weight +
          ")";

        db.query(sql, (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ error: "Something went wrong. Please try again." });
          } else {
            let New_Rubric_Row_ID = result.insertId;

            sql =
              "SELECT * FROM COLUMNS WHERE Rubric_Row_ID=" +
              Old_Rubric_Row_ID +
              " ORDER BY Column_No";

            db.query(sql, (err, result) => {
              if (err) {
                return res
                  .status(400)
                  .json({ error: "Something went wrong. Please try again." });
              } else {
                sql = "";

                result.forEach(row => {
                  Column_No = row.Column_No;
                  Value = row.Value;

                  sql +=
                    " INSERT INTO COLUMNS(Column_No,Value,Rubric_Row_ID) VALUES(" +
                    Column_No +
                    "," +
                    db.escape(Value) +
                    "," +
                    New_Rubric_Row_ID +
                    "); ";
                });
                db.query(sql, (err, result) => {
                  if (err)
                    return res
                      .status(400)
                      .json({ error: "There was some problem adding it" });
                  else {
                    RowsList.shift();
                    duplicateRows(
                      res,
                      New_Cycle_ID,
                      Outcome_List,
                      New_Outcome_ID,
                      Measure_List,
                      New_Measure_ID,
                      Rubric_Measure_ID,
                      New_Rubric_Measure_ID,
                      Old_Rubric_ID,
                      Rubric_ID,
                      RowsList
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    Measure_List.shift();
    duplicateMeasures(
      res,
      New_Cycle_ID,
      Outcome_List,
      New_Outcome_ID,
      Measure_List
    );
  }
};
module.exports = router;
