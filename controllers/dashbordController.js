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
      // 1. بررسی وجود شناسه کاربر
      if (!req.user || !req.user._id) {
        // اگر کاربر احراز هویت نشده باشد، به صفحه ورود هدایت کنید
        return res.redirect("/api/auth/login");
      }

      // 2. ⭐ خواندن آخرین اطلاعات کاربر از دیتابیس ⭐
      // این تضمین می‌کند که موجودی (Balance) پس از پرداخت به‌روز است.
      const user = await Users.findById(req.user._id);

      // اگر کاربر پیدا نشد (نباید اتفاق بیفتد)
      if (!user) {
        return res.redirect("/api/auth/login");
      }

      // 3. ویو را رندر کرده و موجودی را به آن پاس می‌دهیم
      res.render("./../views/dashbord/index", {
        // متغیر balance حاوی مقدار موجودی برحسب ریال است
        balance: user.balance || 0,
        // همچنین متغیر user کامل برای نمایش نام و عکس نیز ارسال می‌شود
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
      // فرض می‌کنیم ورودی تومان است (مثلا 30000 تومان)
      let finalAmount = amount * 10; // تبدیل به ریال (300000 ریال)

      // برای تست در Sandbox، مبلغ باید حداقل 10000 ریال باشد
      if (finalAmount < 10000) finalAmount = 10000;

      // ⭐ تنظیمات Sandbox برای تست (رفع خطای -11) ⭐
      const MERCHANT_ID = "00000000-0000-0000-0000-000000000000";
      const PAYMENT_URL =
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
      const GATEWAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/";

      let params = {
        merchant_id: MERCHANT_ID,
        amount: finalAmount,
        callback_url: "http://127.0.0.1:3000/api/homecallback", // تغییر به 127.0.0.1
        description: "Increase account credit",
      };

      const response = await axios.post(PAYMENT_URL, params);

      if (
        response.data &&
        response.data.data &&
        response.data.data.code === 100
      ) {
        let authority = response.data.data.authority;

        // ⭐ ذخیره درخواست پرداخت در دیتابیس ⭐
        await Payment.create({
          user: req.user._id,
          authority: authority,
          amount: finalAmount,
          payment: false,
        });

        // هدایت کاربر به صفحه پرداخت
        return res.redirect(`${GATEWAY_URL}${authority}`);
      } else {
        // هندل کردن خطا
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
