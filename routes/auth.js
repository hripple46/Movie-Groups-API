const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.js");
var express = require("express");
var router = express.Router();

passport.use(
  new LocalStrategy(async function (username, password, done) {
    console.log(username, password);
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (user.password !== password) {
      console.log("incorrect password");
      return done(null, false, { message: "Incorrect password." });
    } else {
      console.log("correct password");
      return done(null, user);
    }
  })
);

passport.serializeUser(function (user, done) {
  console.log("serializing");
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    console.log("deserializing");
    done(err, user);
  });
});

router.post(
  "/api/users/login",
  passport.authenticate("local", {
    successRedirect: "/api/message",
    failureRedirect: "api/user/login",
  })
);

module.exports = router;
