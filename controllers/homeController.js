const Controller = require("./controller");
let Users = require("./../model/user");
const { body, validationResult } = require("express-validator");
const { ApiHelpers, ApiError } = require("./helper");
const axios = require("axios");
const Payment = require("./../model/payment");

class homeController extends Controller {
  async Example1(req, res) {
    try {
      let userHaveAccess = false;
      // do something

      // do something

      // do something

      // some code

      if (!userHaveAccess) {
        ApiHelpers.ResponseForbidden(res, new ApiError("you cant do it bro!"));
        return;
      }
      ApiHelpers.ResponseOK(res, { name: "sdf", age: 123 });
    } catch (e) {
      ApiHelpers.ResponseServerError(res, e);
    }
  }

  async paycallback(req, res, next) {
    try {
      const { Status, Authority } = req.query;

      const VERIFY_URL =
        "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
      const MERCHANT_ID = "00000000-0000-0000-0000-000000000000";

      if (Status !== "OK" || !Authority) {
        req.flash("errors", "Transaction failed or cancelled by user.");
        return res.redirect("/api/dashbord");
      }

      let paymentRecord = await Payment.findOne({
        authority: Authority,
        payment: false,
      });

      if (!paymentRecord) {
        req.flash("errors", "Payment record not found or already processed.");
        return res.redirect("/api/dashbord");
      }

      const verifyParams = {
        merchant_id: MERCHANT_ID,
        authority: Authority,
        amount: paymentRecord.amount,
      };

      const verifyResponse = await axios.post(VERIFY_URL, verifyParams);
      const verifyCode = verifyResponse.data.data.code;

      if (verifyCode === 100) {
        let refId = verifyResponse.data.data.ref_id;

        await Payment.updateOne(
          { _id: paymentRecord._id },
          {
            $set: {
              payment: true,
              resnumber: refId,
            },
          }
        );

        await Users.updateOne(
          { _id: paymentRecord.user },
          {
            $inc: { balance: paymentRecord.amount },
          }
        );

        req.flash("success", `Transaction successful. Tracking code: ${refId}`);
        return res.redirect("/api/dashbord");
      } else {
        req.flash("errors", `Payment verification failed. Code: ${verifyCode}`);
        return res.redirect("/api/dashbord");
      }
    } catch (err) {
      console.error("Payment Callback Error:", err.message);
      req.flash("errors", "An error occurred during payment verification.");
      next(err);
    }
  }
}

module.exports = new homeController();
