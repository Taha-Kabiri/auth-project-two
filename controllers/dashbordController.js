const Controller = require("./controller");
let Users = require("./../model/user");
let Payment = require("./../model/payment");
const { body, validationResult } = require("express-validator");
const { ApiHelpers, ApiError } = require("./helper");
const axios = require("axios");
class dashbordController extends Controller {
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
  async index(req, res, next) {
    try {
      if (!req.user || !req.user._id) {
        return res.redirect("/api/auth/login");
      }

      const user = await Users.findById(req.user._id);

      if (!user) {
        return res.redirect("/api/auth/login");
      }

      res.render("./../views/dashbord/index", {
        balance: user.balance || 0,

        user: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async edituser(req, res, next) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        req.flash("errors", error.array());
        return res.redirect("/api/dashbord");
      }

      console.log("Received Body:", req.body);
      console.log("User ID (req.body.id):", req.body.id);
      console.log(
        "File Upload Status:",
        req.file ? "File received" : "No file"
      );

      let data = {
        firstname: req.body.firstname,
      };

      if (req.file) {
        data.img = req.file.path.replace(/\\/g, "/").substring(6);
      }

      await Users.updateOne({ _id: req.body.id }, { $set: data });
      res.redirect("/api/dashbord");
    } catch (err) {
      next(err);
    }
  }

  async pay(req, res, next) {
    try {
      let amount = parseInt(req.body.amount);
      let finalAmount = amount * 10;

      if (finalAmount < 10000) finalAmount = 10000;

      const MERCHANT_ID = "00000000-0000-0000-0000-000000000000";
      const PAYMENT_URL =
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
      const GATEWAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/";

      let params = {
        merchant_id: MERCHANT_ID,
        amount: finalAmount,
        callback_url: "http://127.0.0.1:3000/api/homecallback",
        description: "Increase account credit",
      };

      const response = await axios.post(PAYMENT_URL, params);

      if (
        response.data &&
        response.data.data &&
        response.data.data.code === 100
      ) {
        let authority = response.data.data.authority;

        await Payment.create({
          user: req.user._id,
          authority: authority,
          amount: finalAmount,
          payment: false,
        });

        return res.redirect(`${GATEWAY_URL}${authority}`);
      } else {
        let errorMsg =
          response.data.data.message || `Code: ${response.data.data.code}`;
        req.flash("errors", `Payment Request Failed: ${errorMsg}`);
        return res.redirect("/api/dashbord");
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new dashbordController();
