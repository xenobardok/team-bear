const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("./secret");
const db = require("./connection");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      let sql =
        "Select * from Evaluators where email=" + db.escape(jwt_payload.email);
      db.query(sql, (err, result) => {
        //console.log(result[0]);
        if (err) return err;
        else if (result.length > 0) {
          // data = result[0];

          // data = {
          //   ...data,
          //   type: jwt_payload.type
          // };
          return done(null, jwt_payload);
        } else return done(null, false);
      });
    })
  );
};
