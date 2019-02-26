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
    } else {
      res.status(404).json({ error: "Not an Admin" });
    }
  }
);

module.exports = router;
