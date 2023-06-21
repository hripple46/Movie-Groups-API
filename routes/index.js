var express = require("express");
var router = express.Router();
const MessageSchema = require("../models/message.js");
const User = require("../models/user.js");

router.get("/api/message", async function (req, res, next) {
  const Messages = await MessageSchema.find();

  if (!Messages) {
    res.status(404).send("No messages found");
  } else {
    res.json(Messages);
  }
});
router.post("/api/message", async function (req, res, next) {
  const message = new MessageSchema({
    text: req.body.text,
  });
  await message.save();
  res.status(201).send();
});
router.post("/api/users/signup", async function (req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  await user.save();
  res.status(201).send();
});

module.exports = router;
