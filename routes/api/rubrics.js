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
    const email = req.user.Email;
    const type = req.user.type;
    if (type == "Admin") {
      let sql =
        "SELECT * FROM Evaluators natural join Department natural join RUBRIC where Admin_Email = Email and Email =  ('" +
        email +
        "')";

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
    const email = db.escape(req.user.Email);
    const type = req.user.type;
    const dept = db.escape(req.user.Dept_ID);

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
        "AND Rubric_Name=" +
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

                        for (var j = 1; j <= rubricFields.Column_Num; j++) {
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
                            .json({ message: "Successfully Added" });
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
    if (done) {
      return res.status(200).json({
        message: "Successfully added"
      });
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

    const email = db.escape(req.user.Email);
    const type = req.user.type;
    const dept = db.escape(req.user.Dept_ID);
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
        if (err) return res.status(400).json({ error: "Rubric Not Found" });
        else {
          if (result.length < 1) {
            return res.status(400).json({ error: "Rubric Not Found" });
          }
          Rubric.Rubric_ID = Rubric_ID;
          Rubric.Rubric_Name = result[0].Rubric_Name;
          Rubric.Rows_Num = result[0].Rows_Num;
          Rubric.Column_Num = result[0].Column_Num;
          Rubric.Scale = [];
          Rubric.data = [];

          sql =
            "SELECT * FROM RUBRIC NATURAL JOIN RUBRIC_SCALE WHERE Rubric_ID =" +
            Rubric_ID;

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
                "SELECT * FROM RUBRIC_ROW NATURAL JOIN ROW_LABELS WHERE Rubric_ID =" +
                Rubric_ID +
                " ORDER BY Sort_Index";

              db.query(newSql, (err, result) => {
                if (err) return res.status(404).json(err);
                else {
                  result.forEach(row => {
                    var Rubric_Row_ID = row.Rubric_Row_ID;
                    var Row_ID = row.Row_ID;
                    var Sort_Index = row.Sort_Index;
                    var Measure_Factor = row.Measure_Factor;
                    var Column_values = [];
                    var newSql2 =
                      "SELECT * FROM ROW_LABELS NATURAL JOIN COLUMNS WHERE Row_ID =" +
                      Row_ID +
                      " ORDER BY Column_No";
                    console.log(newSql2);
                    db.query(newSql2, (err, result) => {
                      if (err) return res.status(404).json(err);
                      else {
                        result.forEach(row => {
                          var eachColumn = {
                            Column_No: row.Column_No,
                            value: row.Value
                          };
                          Column_values.push(eachColumn);
                        });

                        //console.log(Rubric.Column_Num - result.length);
                        for (
                          j = 0;
                          j < Rubric.Column_Num - result.length;
                          j++
                        ) {
                          var eachColumn = {
                            Column_No: null,
                            value: null
                          };
                          Column_values.push(eachColumn);
                        }
                        var eachRow = {
                          Row_ID: Row_ID,
                          Measure_Factor: Measure_Factor,
                          Column_values: Column_values
                        };
                        Rubric.data.push(eachRow);
                      }
                    });
                  });
                  console.log(Rubric.Rows_Num - result.length);
                  for (i = 0; i < Rubric.Rows_Num - result.length; i++) {
                    var Column_values = [];
                    for (j = 0; j < Rubric.Column_Num; j++) {
                      var eachColumn = {
                        Column_No: null,
                        value: null
                      };
                      Column_values.push(eachColumn);
                    }
                    var eachRow = {
                      Row_ID: null,
                      Measure_Factor: null,
                      Column_values: Column_values
                    };

                    Rubric.data.push(eachRow);
                    //console.log(Rubric);
                  }
                  console.log(Rubric);
                  return res.json(Rubric);
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

// @route   POST api/rubrics/edit/rubrics:handle
// @desc    update the changes in  a Rubric
// @access  Private route
router.post(
  "/edit/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get Fields
  }
);

module.exports = router;
