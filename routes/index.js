var express = require("express");
var router = express.Router();
const MessageSchema = require("../models/message.js");
const User = require("../models/user.js");
const passport = require("passport");

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
router.post("/", async function (req, res, next) {
  const message = new MessageSchema({
    text: req.body.text,
  });
  await message.save();
  res.status(201).send();
});

module.exports = router;
