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
router.post("/pendingusers", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const groups = req.body;
      console.log(req.body);

      // Assign an anonymous async function to getUsers variable
      const getUsers = async () => {
        // Use map instead of forEach to create an array of promises
        const groupPromises = groups.map((element) =>
          Group.findOne({ _id: `${element}` })
        );
        // Wait for all promises to resolve
        const pendingUsers = await Promise.all(groupPromises);
        // Log the results
        console.log("groups: " + pendingUsers);
        pendingUsers.forEach((group) => console.log(group.pendingusers));
        return pendingUsers;
      };

      // Call getUsers and respond to the client
      try {
        const pendingUsers = await getUsers();
        res.status(200).json({ pendingUsers });
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
    }
  });
});
router.post("/pendingusers/details", verifyToken, async (req, res, next) => {
  let resultArray = [];
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    for (const element of req.body) {
      console.log("Req Body: ", element);
      const group = await Group.findById(element.group);
      const resultObject = { Group: group.name, Users: [] };
      for (const user of element.users) {
        const userDoc = await User.findById(user);
        const username = userDoc.username;
        resultObject.Users.push(username);
        console.log("Username: " + username);
      }
      resultArray.push(resultObject);
    }
    console.log("Result Array: " + resultArray);
    res.json(resultArray);
  });
});

module.exports = router;
