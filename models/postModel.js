const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, requiried: true },
  body: { type: String, requiried: true },
  image: { type: String, requiried: true },
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true }
});

const post = mongoose.model("post", postSchema);

module.exports = post;