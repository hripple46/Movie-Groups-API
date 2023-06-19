var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/api/test", function (req, res, next) {
  res.json({ message: "hooray! Henry's very first api!" });
});

module.exports = router;
