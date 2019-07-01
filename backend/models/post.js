const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  gender: { type: String, required: true },
  birthday: { type: String, required: true },
  workexp: { type: String, required: true },
  technologies : { type: String, required: true },
  email: { type: String, required: true },
  phone : { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Post", postSchema);
