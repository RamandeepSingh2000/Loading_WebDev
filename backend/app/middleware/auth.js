var User = require("../models/user.model");
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
const jwtSecret = process.env.JWT_SECRET;
var params = {
secretOrKey: jwtSecret,
 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
 };

 module.exports = function() {
 var strategy = new Strategy(params, function(payload, done) {
 User.findById(payload.id)
 .then(user => {
    if (payload.expire <= Date.now()) {
 return done(new Error("TokenExpired"), null);
 } else{
 return done(null, user);
 }
 })
 .catch(err => {
    return done(new Error("UserNotFound"), null)
})
 });

 passport.use(strategy);

 return { initialize: function() { return passport.initialize() }};
 };