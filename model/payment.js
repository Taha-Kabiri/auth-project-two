const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  resnumber: { type: String, required: false, default: "" },

  amount: { type: Number, required: true },
  authority: { type: String, required: true },
  payment: { type: Boolean, default: false },
});

module.exports = mongoose.model("Payment", PaySchema, "Payment");
