const Controller = require("./controller");
let Users = require("./../model/user");
const { body, validationResult } = require("express-validator");
const { ApiHelpers, ApiError } = require("./helper");

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
      res.render('./../views/auth/register' , {errors: req.flash("errors")});

    } catch (err) {
      next(err);
    }
  }
 
   async loginForm(req, res, next) {
    try {
        res.render('./../views/auth/login',{errors: req.flash("errors")})
      
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
      console.log("register");
      
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
      console.log("login");
      
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
