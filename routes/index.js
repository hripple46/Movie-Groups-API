var express = require("express");
var router = express.Router();
const MessageSchema = require("../models/message.js");

/* GET home page. */
router.get("/api/test", function (req, res, next) {
  res.json({ message: "hooray! Henry's very first api!" });
});
router.post("/api/message", function (req, res, next) {
  const message = new MessageSchema({
    text: req.body.text,
  });
});

module.exports = router;
