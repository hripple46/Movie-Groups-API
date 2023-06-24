const User = require("../models/user.js");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", async function (req, res, next) {
  console.log(req.body);
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    if (req.body.password === user.password) {
      jwt.sign({ user }, "secretkey", (err, token) => {
        res.json({ token });
      });
    } else {
      res.send("Incorrect Password");
    }
  } else {
    res.send('{"message": "User Not Found"}');
  }
});

router.post("/signup", async function (req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  await user.save();
  res.status(201).send();
});

module.exports = router;
