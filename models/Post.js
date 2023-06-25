const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  movie: {
    type: String,
    required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("User", PostSchema);
