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

module.exports = router;
