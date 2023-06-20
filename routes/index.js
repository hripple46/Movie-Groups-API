var express = require("express");
var router = express.Router();
const MessageSchema = require("../models/message.js");

/* GET home page. */
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
});

module.exports = router;
