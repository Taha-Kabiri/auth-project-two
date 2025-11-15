const Controller = require("./controller");
let Users = require("./../model/user");
const { body, validationResult } = require("express-validator");
const { ApiHelpers, ApiError } = require("./helper");
const passport = require("passport");

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
      res.render("./../views/auth/register", { errors: req.flash("errors") });
    } catch (err) {
      next(err);
    }
  }

  async loginForm(req, res, next) {
    try {
      res.render("./../views/auth/login", { errors: req.flash("errors") });
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
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