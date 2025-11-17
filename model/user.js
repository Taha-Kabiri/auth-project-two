const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true, minlength: [3], maxlength: [20] },
  email: { type: String, required: true, maxlength: [30], unique: true },
  password: { type: String, minlength: [5], required: true },
});

module.exports = mongoose.model("User", userSchema, "User");
