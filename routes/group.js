const User = require("../models/user.js");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Group = require("../models/Group.js");

router.post("/", verifyToken, async function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const username = authData.user.username;
      const user = await User.findOne({ username: username });
      const group = new Group({
        name: req.body.groupName,
        admin: user._id,
      });
      await group.save();
      res.json({
        message: "Group Created",
        group,
      });
    }
  });
});

function verifyToken(req, res, next) {
  //get auth header
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);

  if (typeof bearerHeader !== "undefined") {
    //split header
    const bearer = bearerHeader.split(" ");
    //get token
    const bearerToken = bearer[1];
    //set token
    req.token = bearerToken;
    //next middleware
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;