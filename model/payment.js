// model/payment.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // ⭐ اصلاح: resnumber پس از تأیید در دسترس است، پس نباید required باشد ⭐
  resnumber: { type: String, required: false, default: "" },

  amount: { type: Number, required: true },
  authority: { type: String, required: true }, // اضافه کردن authority برای جستجو
  payment: { type: Boolean, default: false },
});

module.exports = mongoose.model("Payment", PaySchema, "Payment");
