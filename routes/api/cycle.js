const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");

// @route   GET api/cycle
// @desc    Gets the lists of all rubrics
// @access  Private

const isEmpty = require("../../validation/isEmpty");

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
      if (isEmpty(name)) {
        return res
          .status(404)
          .json((errors = { Cycle_Name: "Cycle Name cannot be empty" }));
      }
      let sql =
        "SELECT Cycle_ID FROM ASSESSMENT_CYCLE WHERE Dept_ID =" +
        dept +
        " AND Cycle_Name=" +
        name;
      //console.log(sql);
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

// @route   GET api/cycle/cycle:handle
// @desc    get the values of a given cycle
// @access  Private route
router.get(
  "/:handle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    if (type == "Admin") {
      const Cycle_ID = req.params.handle;
      const Cycle = {};

      let sql =
        "SELECT * FROM ASSESSMENT_CYCLE WHERE DEPT_ID =" +
        dept +
        " AND Cycle_ID = " +
        Cycle_ID;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length < 1) {
            return res.status(404).json({ error: "Cycle Not Found" });
          }

          Cycle.Cycle_ID = Cycle_ID;
          Cycle.Cycle_Name = result[0].Cycle_Name;
          Cycle.Is_Submitted = result[0].isSubmitted;
          Cycle.data = [];
          sql =
            "SELECT * FROM OUTCOMES WHERE Cycle_ID = " +
            Cycle_ID +
            " ORDER BY Outcome_Index";

          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              result.forEach(row => {
                outcome = {
                  Outcome_ID: row.Outcome_ID,
                  Outcome_Name: row.Outcome_Name,
                  Outcome_Index: row.Outcome_Index
                };

                Cycle.data.push(outcome);
              });

              return res.status(200).json(Cycle);
            }
          });
        }
      });
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

// @route   POST api/cycle/:cycleID/outcome/create
// @desc    Create a new outcome
// @access  Private
router.post(
  "/:cycleID/outcome/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Cycle_ID = db.escape(req.params.cycleID);
    let Outcome_Name = req.body.Outcome_Name;
    const errors = {};
    if (type == "Admin") {
      console.log(isEmpty(Outcome_Name));
      if (isEmpty(Outcome_Name)) {
        return res
          .status(404)
          .json((errors.Outcome_Name = "Outcome Name cannot be empty"));
      }
      Outcome_Name = db.escape(Outcome_Name);
      let sql =
        "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
        dept +
        " AND Cycle_ID=" +
        Cycle_ID +
        " AND Outcome_Name =" +
        Outcome_Name;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length > 0) {
            errors.Cycle_Name = "Outcome with that name already exists.";
            return res.status(404).json(errors);
          }

          sql =
            "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
            dept +
            " AND Cycle_ID=" +
            Cycle_ID;

          db.query(sql, (err, result) => {
            if (err) res.send(err);
            else {
              if (err) {
                return res.status(404).json(err);
              }
              let Outcome_Index = 0;
              if (result.length != 0) {
                Outcome_Index = result[result.length - 1].Outcome_Index + 1;
              }

              sql =
                "INSERT INTO OUTCOMES(Cycle_ID, Outcome_Name, Outcome_Index) VALUES(" +
                Cycle_ID +
                "," +
                Outcome_Name +
                "," +
                Outcome_Index +
                ")";

              db.query(sql, (err, result) => {
                if (err)
                  return res
                    .status(400)
                    .json({ error: "There was some problem adding it" });
                else {
                  let Outcome_ID = db.escape(result.insertId);

                  res.status(200).json((outcome = { Outcome_ID: Outcome_ID }));
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

// @route   POST api/cycle/:cycleID/outcome/update
// @desc    Update an old outcome
// @access  Private
router.post(
  "/:cycleID/outcome/update/:outcomeID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const Cycle_ID = db.escape(req.params.cycleID);
    const Outcome_ID = db.escape(req.params.outcomeID);
    let Outcome_Name = req.body.Outcome_Name;

    if (type == "Admin") {
      if (isEmpty(Outcome_Name)) {
        return res
          .status(404)
          .json((errors = { Outcome_Name: "Outcome Name cannot be empty" }));
      }
      Outcome_Name = db.escape(Outcome_Name);
      let sql =
        "SELECT * FROM OUTCOMES NATURAL JOIN ASSESSMENT_CYCLE WHERE Dept_ID =" +
        dept +
        " AND Cycle_ID=" +
        Cycle_ID +
        " AND Outcome_Name =" +
        Outcome_Name;

      db.query(sql, (err, result) => {
        if (err) res.send(err);
        else {
          if (result.length > 0) {
            errors.Cycle_Name = "Outcome with that name already exists.";
            return res.status(404).json(errors);
          }

          sql =
            "UPDATE OUTCOMES SET Outcome_Name = " +
            Outcome_Name +
            " WHERE Outcome_ID = " +
            Outcome_ID;

          db.query(sql, (err, result) => {
            if (err)
              return res
                .status(400)
                .json({ error: "There was some problem updating it" });
            else {
              res.status(200).json("Outcome was successfully updated");
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
