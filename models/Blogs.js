const mongoose = require("mongoose");
const { Schema } = mongoose;
const BlogsSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    // required:true,
    ref: "user",
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: "General",
  },
  privacy: {
    type: String,
    default: "public",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("blogs", BlogsSchema);
