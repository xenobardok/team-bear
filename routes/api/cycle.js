const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");

// @route   GET api/cycle
// @desc    Gets the lists of all rubrics
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;

    let sql =
      "SELECT * FROM ASSESSMENT_CYCLE WHERE Dept_ID = ('" +
      dept +
      "') order by Dept_ID DESC";
    db.query(sql, (err, result) => {
      var cycles = [];
      if (err) return res.send(err);
      else if (result.length > 0) {
        result.forEach(row => {
          aCycle = {
            Cycle_ID: row.Cycle_ID,
            Cycle_Name: row.Cycle_Name,
            Is_Submitted: row.Is_Submitted
          };
          cycles.push(aCycle);
        });
      }
      res.json(cycles);
    });
  }
);

// @route   POST api/cycle
// @desc    Create a new cycle
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);

    //console.log(req.user);
    if (type == "Admin") {
      const name = db.escape(req.body.Cycle_Name);

      let sql =
        "SELECT Cycle_ID FROM ASSESSMENT_CYCLE WHERE Dept_ID =" +
        dept +
        " AND Cycle_Name=" +
        name;
      console.log(sql);
      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length > 0) {
            errors.Cycle_Name = "Cycle with that name already exists.";
            return res.status(404).json(errors);
          }

          let False = db.escape("false");
          sql =
            "INSERT INTO ASSESSMENT_CYCLE(Cycle_Name, Dept_ID,isSubmitted) VALUES(" +
            name +
            "," +
            dept +
            "," +
            False +
            ")";

          db.query(sql, (err, result) => {
            if (err)
              return res
                .status(400)
                .json({ error: "There was some problem adding it" });
            else {
              let Cycle_ID = db.escape(result.insertId);

              res.status(200).json((cycle = { Cycle_ID: Cycle_ID }));
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
