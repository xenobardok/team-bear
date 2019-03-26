const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");

// Loading Input Validation
const validateRubricInput = require("../../validation/rubric");

// @route   GET api/rubrics
// @desc    Gets the lists of all rubrics
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    if (type == "Admin") {
      let sql =
        "SELECT * FROM Evaluators natural join Department natural join RUBRIC where Admin_Email = Email and Email =  ('" +
        email +
        "') order by Rubric_ID";

      db.query(sql, (err, result) => {
        var Rubrics = [];
        if (err) return res.send(err);
        else if (result.length > 0) {
          result.forEach(row => {
            aRubric = {
              Rubric_ID: row.Rubric_ID,
              Rubrics_Name: row.Rubric_Name,
              Rows_Num: row.Rows_Num,
              Column_Num: row.Column_Num,
              Scale: row.Scale
            };
            Rubrics.push(aRubric);
          });
        }
        res.json(Rubrics);
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/rubrics
// @desc    Create a nre Rubric
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get Fields
    const rubricFields = {};
    let done = false;

    //console.log(req.body);
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    //console.log(req.user);
    if (type == "Admin") {
      const { errors, isValid } = validateRubricInput(req.body);

      if (!isValid) {
        return res.status(404).json(errors);
      }
      if (req.body.Rubric_Name)
        rubricFields.name = db.escape(req.body.Rubric_Name);
      if (req.body.Rows_Num) rubricFields.Rows_Num = req.body.Rows_Num;
      if (req.body.Column_Num) rubricFields.Column_Num = req.body.Column_Num;
      if (req.body.Scale) {
        rubricFields.Scale = req.body.Scale;
        rubricFields.ScaleSize = db.escape(req.body.Scale.length);
      }

      let sql =
        "SELECT Rubric_ID FROM RUBRIC WHERE Dept_ID =" +
        dept +
        " AND Rubric_Name=" +
        rubricFields.name;

      db.query(sql, (err, result) => {
        if (err) throw err;
        else {
          if (result.length > 0) {
            errors.Rubric_Name = "Rubric with that name already exists.";
            return res.status(404).json(errors);
          }
          sql =
            "INSERT INTO RUBRIC(Rubric_Name, Rows_Num, Column_Num,Scale,Dept_ID) VALUES(" +
            rubricFields.name +
            "," +
            rubricFields.Rows_Num +
            "," +
            rubricFields.Column_Num +
            "," +
            rubricFields.ScaleSize +
            "," +
            dept +
            ")";
          //console.log(sql);

          // CREATE RUBRIC_ROW TABLE WITH Rows_Num and Column_Num
          db.query(sql, (err, result) => {
            if (err)
              return res
                .status(400)
                .json({ error: "There was some problem adding it" });
            else {
              let Rubric_ID = db.escape(result.insertId);
              rubricFields.Scale.forEach(grade => {
                let label = db.escape(grade.label);
                let value = grade.value;
                let newSql =
                  "INSERT INTO RUBRIC_SCALE(Rubric_ID, Score_label, Value) VALUES(" +
                  Rubric_ID +
                  "," +
                  label +
                  "," +
                  value +
                  ")";

                db.query(newSql, (err, result) => {
                  if (err)
                    return res.status(400).json({
                      message:
                        "Scales could not be added, Please try again later."
                    });
                });
              });

              let empty_var = "";
              console.log(empty_var);
              console.log(rubricFields.Rows_Num);
              let row = 1;

              let newSql1 =
                "INSERT INTO RUBRIC_ROW(Rubric_ID,Measure_Factor,Sort_Index) VALUES ?";

              let sqls = [];

              for (var i = 1; i <= rubricFields.Rows_Num; i++) {
                value = [];
                value.push(Rubric_ID);
                value.push(empty_var);
                value.push(i);

                sqls.push(value);
              }
              db.query(newSql1, [sqls], function(err, result) {
                if (err) {
                  throw err;
                } else {
                  sql =
                    "SELECT Rubric_Row_ID FROM RUBRIC_ROW WHERE Rubric_ID = " +
                    Rubric_ID;

                  db.query(sql, (err, result) => {
                    if (err) throw err;
                    else {
                      let newSql2 =
                        "INSERT INTO COLUMNS(Rubric_Row_ID,Column_No,Value) VALUES ?";
                      sqls = [];
                      result.forEach(row => {
                        Rubric_Row_ID = row.Rubric_Row_ID;

                        for (var j = 1; j <= rubricFields.Column_Num - 1; j++) {
                          value = [];
                          value.push(Rubric_Row_ID);
                          value.push(j);
                          value.push(empty_var);

                          sqls.push(value);
                        }
                      });
                      db.query(newSql2, [sqls], function(err, result) {
                        if (err) {
                          throw err;
                        } else {
                          res
                            .status(200)
                            .json((Rubric = { Rubric_ID: Rubric_ID }));
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
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   GET api/rubrics/rubrics:handle
// @desc    get the values of a Rubric
// @access  Private route
router.get(
  "/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get Fields

    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_ID = req.params.handle;
    const Rubric = {};
    if (type == "Admin") {
      let sql =
        "SELECT * FROM RUBRIC where Rubric_ID =" +
        Rubric_ID +
        " AND DEPT_ID = " +
        dept;

      db.query(sql, (err, result) => {
        var Rubrics = {};
        if (err) throw err;
        else {
          if (result.length < 1) {
            return res.status(404).json({ error: "Rubric Not Found" });
          }
          Rubric.Rubric_ID = Rubric_ID;
          Rubric.Rubric_Name = result[0].Rubric_Name;
          Rubric.Rows_Num = result[0].Rows_Num;
          Rubric.Column_Num = result[0].Column_Num;
          Rubric.Scale = [];
          Rubric.data = [];

          sql =
            "SELECT * FROM RUBRIC NATURAL JOIN RUBRIC_SCALE WHERE Rubric_ID =" +
            Rubric_ID +
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
              var newSql =
                "SELECT * FROM RUBRIC_ROW WHERE Rubric_ID =" +
                Rubric_ID +
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
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/rubrics/measures/update/:handle
// @desc    update the changes in  a measure
// @access  Private route
router.post(
  "/measure/update/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get Fields

    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Rubric_Row_ID = req.params.handle;
    const value = db.escape(req.body.Measure_Factor);
    if (type == "Admin") {
      let sql =
        "UPDATE  RUBRIC_ROW SET Measure_Factor = " +
        value +
        " WHERE Rubric_Row_ID = " +
        Rubric_Row_ID;

      db.query(sql, (err, result) => {
        if (err) throw err;
        else {
          res.status(200).json({ message: "Successfully updated the cell" });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/rubrics/column/update/:handle
// @desc    update the changes in  a column cell
// @access  Private route
router.post(
  "/column/update/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get Fields

    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Columns_ID = req.params.handle;
    const value = db.escape(req.body.Value);

    if (type == "Admin") {
      let sql =
        "UPDATE  COLUMNS SET Value = " +
        value +
        " WHERE Columns_ID = " +
        Columns_ID;

      db.query(sql, (err, result) => {
        if (err) throw err;
        else {
          res.status(200).json({ message: "Successfully updated the cell" });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

module.exports = router;
