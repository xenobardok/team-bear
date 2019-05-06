const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const passport = require("passport");
const secret = require("../../config/secret");
var async = require("async");
const validateCycleInput = require("../../validation/cycle");
const Validator = require("validator");
const fs = require("fs");

const isEmpty = require("../../validation/isEmpty");

// @route   GET api/faq
// @desc    Gets the lists of all faq
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;

    Faqs = [];

    sql = "SELECT * FROM FAQ";

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        result.forEach(faq => {
          aFaq = {
            FAQ_ID: faq.FAQ_ID,
            Question: faq.Question,
            Answer: faq.Answer
          };
          Faqs.push(aFaq);
        });
        res.status(200).json(Faqs);
      }
    });
  }
);

// @route   POST api/faq/create
// @desc    Add a FAQ
// @access  Private

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;
    const errors = {};

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          let Question = req.body.Question;
          let Answer = req.body.Answer;

          if (isEmpty(Question)) {
            errors.Question = "Question cannot be empty";
            res.status(400).json(errors);
          } else if (isEmpty(Answer)) {
            errors.Answer = "Answer cannot be empty";
            res.status(400).json(errors);
          } else {
            sql =
              "INSERT INTO FAQ(Question,Answer) VALUES(" +
              db.escape(Question) +
              "," +
              db.escape(Answer) +
              ")";

            db.query(sql, (err, result) => {
              if (err) {
                return res.status(400).json(err);
              } else {
                aFaq = {
                  FAQ_ID: result.insertId,
                  Question: Question,
                  Answer: Answer
                };
                res.status(200).json(aFaq);
              }
            });
          }
        }
      }
    });
  }
);

// @route   POST api/faq/faqID
// @desc    update the faqID
// @access  Private

router.put(
  "/:faqID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;
    const errors = {};
    const FAQ_ID = req.params.faqID;

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM FAQ WHERE FAQ_ID=" + FAQ_ID;

          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                errors.FAQ_ID = "Faq not found";
                res.status(400).json(errors);
              } else {
                let Question = req.body.Question;
                let Answer = req.body.Answer;

                if (isEmpty(Question)) {
                  errors.Question = "Question cannot be empty";
                  res.status(400).json(errors);
                } else if (isEmpty(Answer)) {
                  errors.Answer = "Answer cannot be empty";
                  res.status(400).json(errors);
                } else {
                  sql =
                    "UPDATE FAQ SET Question=" +
                    db.escape(Question) +
                    ", Answer=" +
                    db.escape(Answer) +
                    " WHERE FAQ_ID=" +
                    FAQ_ID;

                  db.query(sql, (err, result) => {
                    if (err) {
                      return res.status(400).json(err);
                    } else {
                      aFaq = {
                        FAQ_ID: FAQ_ID,
                        Question: Question,
                        Answer: Answer
                      };
                      res.status(200).json(aFaq);
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
);

// @route   DELETE api/faq/faqID
// @desc    delete the faqID
// @access  Private

router.delete(
  "/:faqID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.user.email;
    const type = req.user.type;
    const dept = req.user.dept;
    const errors = {};
    const FAQ_ID = req.params.faqID;

    let sql =
      "SELECT * FROM Evaluators WHERE isSuperUSer= 'true' AND Email=" +
      db.escape(email);

    db.query(sql, (err, result) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        if (result.length < 1) {
          return res
            .status(400)
            .json({ User: "You do not have enough privileges" });
        } else {
          sql = "SELECT * FROM FAQ WHERE FAQ_ID=" + FAQ_ID;
          db.query(sql, (err, result) => {
            if (err) return res.status(400).json(err);
            else {
              if (result.length < 1) {
                errors.FAQ_ID = "Faq not found";
                res.status(400).json(errors);
              } else {
                sql = "DELETE FROM FAQ WHERE FAQ_ID=" + FAQ_ID;

                db.query(sql, (err, result) => {
                  if (err) {
                    return res.status(400).json(err);
                  } else {
                    res.status(200).json({ Faq: "FAQ deleted" });
                  }
                });
              }
            }
          });
        }
      }
    });
  }
);
module.exports = router;
