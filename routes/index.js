var express = require("express");
var router = express.Router();
const MessageSchema = require("../models/message.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

router.get("/", async function (req, res, next) {
  const Messages = await MessageSchema.find();

  if (!Messages) {
    res.status(404).send("No messages found");
  } else {
    res.json({
      messages: Messages,
      user: req.user,
    });
  }
});
router.post("/", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const user = authData.user;
      const username = authData.user.username;
      res.json({
        message: "Message posted",
        user,
        username,
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
