const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
const dateformat = require("dateformat");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = db.escape(req.user.email);
    const type = req.user.type;
    const dept = db.escape(req.user.dept);
    let errors = {};
    if (type == "Admin") {
      sql =
        "SELECT From_Email, To_Dept_ID, From_Dept_ID,To_Email,Message, Fname,Mname,Lname, Email ,CONVERT_TZ(Time,'UTC','US/Central') as Time FROM ACTIVITY_LOG A  JOIN  Evaluators E on (From_Email=E.Email AND To_Dept_ID=" +
        dept +
        " ) OR (To_Email=E.Email AND  From_Dept_ID=" +
        dept +
        ")  ORDER BY  Time DESC";

      db.query(sql, (err, result) => {
        if (err) {
          errors.log = "There was error loading the logs";
          return res.status(400).json(errors);
        } else {
          logs = [];
          i = 0;
          while (i < 50 && i < result.length) {
            // for assignments by Admins
            if (
              result[i].From_Email == null &&
              result[i].To_Dept_ID == null &&
              result[i].From_Dept_ID != null &&
              result[i].To_Email != null
            ) {
              To_Email = result[i].To_Email;
              Day = dateformat(result[i].Time, "mmmm dd, yyyy");
              Time = dateformat(result[i].Time, "h:MM TT");

              Fname = result[i].Fname;
              Name = result[i].Fname + " " + result[i].Lname;

              if (Fname == null) {
                Name = To_Email;
              }
              log = "";
              Message = result[i].Message;

              if (req.user.email == To_Email) {
                log = "You " + Message;
              } else {
                log = Name + Message;
              }
              alog = {
                Day: Day,
                Time: Time,
                Message: log
              };
              logs.push(alog);
            }
            // From Submission
            else if (
              result[i].From_Email != null &&
              result[i].To_Dept_ID != null &&
              result[i].From_Dept_ID == null &&
              result[i].To_Email == null
            ) {
              To_Dept = result[i].To_Dept_ID;

              From_Email = result[i].From_Email;

              Day = dateformat(result[i].Time, "mmmm dd, yyyy");
              Time = dateformat(result[i].Time, "h:MM TT");

              Fname = result[i].Fname;
              Name = result[i].Fname + " " + result[i].Lname;

              if (Fname == null) {
                Name = To_Email;
              }
              log = "";
              Message = result[i].Message;
              if (req.user.email == From_Email) {
                log = "You " + Message;
              } else {
                log = Name + Message;
              }
              alog = {
                Day: Day,
                Time: Time,
                Message: log
              };
              logs.push(alog);
            }
            i++;
          }
          res.status(200).json(logs);
        }
      });
    } else {
      sql =
        "SELECT  From_Email, To_Dept_ID, From_Dept_ID,To_Email,Message,CONVERT_TZ(Time,'UTC','US/Central') as Time FROM ACTIVITY_LOG WHERE From_Email=" +
        email +
        " OR To_Email=" +
        email +
        "ORDER BY Time DESC";

      db.query(sql, (err, result) => {
        if (err) {
          errors.log = "There was error loading the logs";
          return res.status(400).json(errors);
        } else {
          logs = [];
          i = 0;
          while (i < 50 && i < result.length) {
            if (
              result[i].From_Email == null &&
              result[i].To_Dept_ID == null &&
              result[i].From_Dept_ID != null &&
              result[i].To_Email != null
            ) {
              To_Email = result[i].To_Email;
              Day = dateformat(result[i].Time, "mmmm dd, yyyy");
              Time = dateformat(result[i].Time, "h:MM TT");

              log = "You " + result[i].Message;
              alog = {
                Day: Day,
                Time: Time,
                Message: log
              };
              logs.push(alog);
            }
            // From Submission
            else if (
              result[i].From_Email != null &&
              result[i].To_Dept_ID != null &&
              result[i].From_Dept_ID == null &&
              result[i].To_Email == null
            ) {
              To_Dept = result[i].To_Dept_ID;

              From_Email = result[i].From_Email;

              Day = dateformat(result[i].Time, "mmmm dd, yyyy");
              Time = dateformat(result[i].Time, "h:MM TT");

              log = "You " + result[i].Message;

              alog = {
                Day: Day,
                Time: Time,
                Message: log
              };
              logs.push(alog);
            }
            i++;
          }
          res.status(200).json(logs);
        }
      });
    }
  }
);

module.exports = router;
