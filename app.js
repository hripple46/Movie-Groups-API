require("dotenv").config();
const mongoose = require("mongoose");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const session = require("express-session");

const User = require("./models/user");

var indexRouter = require("./routes/index");

var authRouter = require("./routes/auth");

const groupRouter = require("./routes/group");

var app = express();

mongoose.connect(process.env.MONGODB_PASSWORD);

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/message", indexRouter);
app.use("/api/users", authRouter);
app.use("/api/groups", groupRouter);
app // catch 404 and forward to error handler
  .use(function (req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
