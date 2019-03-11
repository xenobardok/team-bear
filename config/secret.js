if (process.env.NODE_ENV === "production") {
  module.exports = { secretOrKey: process.env.SECRET };
} else {
  module.exports = require("./secret_dev");
}
