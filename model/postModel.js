const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  body: String,
  createdAt: String,
  username: String,
  userid: String,
  comments: [
    {
      body: String,
      username: String,
      userid: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      userid: String,
      createdAt: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("Post", postSchema);
