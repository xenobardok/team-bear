const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");

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
        var Rubrics = {};
        if (err) return res.send(err);
        else if (result.length > 0) {
          result.array.forEach(row => {
            Rubrics = {
              ...Rubrics,
              Rubric_ID: row.Rubric_ID,
              Rubrics_Name: row.Rubric_Name,
              Rows_Num: row.Rows_Num,
              Column_Num: row.Column.Num,
              Scale: row.Scale
            };
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

    const email = db.escape(req.user.Email);
    const type = req.user.type;
    const dept = db.escape(req.user.Dept_ID);

    if (req.body.Rubric_Name)
      rubricFields.name = db.escape(req.body.Rubric_Name);
    if (req.body.Rows_Num) rubricFields.Rows_Num = req.body.Rows_Num;
    if (req.body.Column_Num) rubricFields.Column_Num = req.body.Column_Num;
    if (req.body.Scale) {
      rubricFields.Scale = req.body.Scale;
      rubricFields.ScaleSize = req.body.Scale.length;
    }

    if (type == "Admin") {
      let sql =
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

      db.query(sql, (err, result) => {
        var Rubrics = {};
        if (err)
          return res
            .status(400)
            .json({ error: "Rubric already exists with that name" });
        else {
          sql =
            "SELECT Rubric_ID FROM RUBRIC WHERE Dept_ID =" +
            dept +
            "AND Rubric_Name=" +
            rubricFields.name;

          db.query(sql, (err, result) => {
            if (err)
              return res.status(400)({
                error: "Rubric not be added, Please try again later."
              });
            else {
              const Rubric_ID = result[0].Rubric_ID;

              rubricFields.Scale.forEach(grade => {
                var label = db.escape(grade.label);
                var value = grade.value;
                var newSql =
                  "INSERT INTO RUBRIC_SCALE(Rubric_ID, Score_label, Value) VALUES(" +
                  Rubric_ID +
                  "," +
                  label +
                  "," +
                  value +
                  ")";

                db.query(newSql, (err, result) => {
                  if (err)
                    return res.status(400)({
                      error:
                        "Scales could not be added, Please try again later."
                    });
                });
              });
              res.status(200).json({ message: "Successfully added" });
            }
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

module.exports = router;
