const express = require("express");
const router = express.Router(),
  db = require("../../config/connection"),
  jwt = require("jsonwebtoken"),
  secret = require("../../config/secret"),
  passport = require("passport");

// @route   GET api/profiles
// @desc    Gets profiles
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.Email;
    const type = req.user.type;
    if (type == "Admin") {
      res.json(req.user);
    } else {
      res.json(req.user);
    }
  }
);

// @route   GET api/cycle
// @desc    Gets the details of last accessed cycle
// @access  Private

router.get(
  "/cycle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    const errors = {};
    const Cycle = {};
    Cycle.Cycle_ID = "";

    let sql = "SELECT Last_Cycle_ID FROM Evaluators WHERE Email= " + email;

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        if (result.length > 0) {
          let Last_Cycle_ID = result[0].Last_Cycle_ID;

          let sql =
            "SELECT * FROM ASSESSMENT_CYCLE WHERE isSubmitted='false' AND Dept_ID = " +
            dept +
            " AND Cycle_ID=" +
            Last_Cycle_ID;

          db.query(sql, (err, result) => {
            if (err) return res.send(err);
            else if (result.length > 0) {
              Cycle.Cycle_ID = result[0].Cycle_ID;
              Cycle.Cycle_Name = result[0].Cycle_Name;
              Cycle.Is_Submitted = result[0].Is_Submitted;
            }
            return res.status(200).json(Cycle);
          });
        } else {
          // console.log(cycles);
          return res.status(200).json(Cycle);
        }
      }
    });
  }
);

module.exports = router;
