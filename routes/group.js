const User = require("../models/user.js");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Group = require("../models/Group.js");

router.post("/", verifyToken, async function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
      return;
    } else {
      const username = authData.user.username;
      const user = await User.findOne({ username: username });
      console.log("Here's the REQ BODY" + req.body.groupName);
      const checkGroup = await Group.findOne({ name: req.body.groupName });
      if (checkGroup) {
        res.sendStatus(403);
        return;
      }
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
router.post("/join", verifyToken, async function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const username = authData.user.username;
      const user = await User.findOne({ username: username });
      const reqGroup = await Group.findOne({ name: req.body.joinGroupName });
      console.log("Join This Group" + reqGroup);
      const currentUsers = reqGroup.activeUsers;

      for (let i = 0; i < currentUsers.length; i++) {
        if (currentUsers[i].toString() === user._id.toString()) {
          return res.json("User already belongs to group");
        }
      }

      reqGroup.pendingUsers.push(user.id);
      await reqGroup.save();
      res.json("Request to join group sent");
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
