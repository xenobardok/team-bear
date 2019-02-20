const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('./secret');
const db = require('./connection');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) =>{
            let sql = "Select * from users where email="+ db.escape(jwt_payload.email);
            db.query(sql, (err, result) => {
                if(err) return err;
                else if(result.length>0) return done(null, result);
                else return done(null, false);
            })
    }))
}