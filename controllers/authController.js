const Controller = require("./controller");
let Users = require("./../model/user");
const { body, validationResult } = require("express-validator");
const { ApiHelpers, ApiError } = require("./helper");
const passport = require("passport");
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const options = { "hl ": "en" };
const recaptcha = new Recaptcha(
  "6LczYRAsAAAAAEqyUt4aT9yfngmaLHgcR-1mIznd",
  "6LczYRAsAAAAANyYGs2BzTTPmgLv2LYbPTiCs7Cq",
  options
);
class UserController extends Controller {
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
  async registerForm(req, res, next) {
    try {
      const viewLocals = {
        // errors: req.flash("errors"),
        recaptcha: recaptcha.render(),
      };
      res.render("./../views/auth/register", viewLocals);
    } catch (err) {
      next(err);
    }
  }

  async loginForm(req, res, next) {
    try {
      const viewLocals = {
        // errors: req.flash("errors"),
        recaptcha: recaptcha.render(),
      };
      res.render("./../views/auth/login", viewLocals);
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      let recaptchaResult = await new Promise((resolve, reject) => {
        recaptcha.verify(req, (err, data) => {
          if (err) {
            req.flash("errors", [{ msg: "Check the security option" }]);
            res.redirect("/api/auth/register");
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (!recaptchaResult) {
        return;
      }

      const error = validationResult(req);
      if (!error.isEmpty()) {
        req.flash("errors", error.array());
        return res.redirect("/api/auth/register");
      }
      passport.authenticate("local.register", {
        successRedirect: "/api/dashbord",
        failureRedirect: "/api/auth/register",
        failureFlash: true,
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      let recaptchaResult = await new Promise((resolve, reject) => {
        recaptcha.verify(req, (err, data) => {
          if (err) {
            req.flash("errors", [{ msg: "Check the security option" }]);
            res.redirect("/api/auth/login");
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });

      if (!recaptchaResult) {
        return;
      }

      const error = validationResult(req);
      if (!error.isEmpty()) {
        req.flash("errors", error.array());
        return res.redirect("/api/auth/login");
      }
      // Corrected login logic to use the standard custom callback pattern for better error handling
      passport.authenticate("local.login", (err, user, info) => {
        if (err) {
          return next(err); // Handle server-side errors
        }
        if (!user) {
          // Passport local strategy will set flash messages on failure, so just redirect
          return res.redirect("/api/auth/login");
        }
        // Log the user in after successful authentication
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/api/dashbord");
        });
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
