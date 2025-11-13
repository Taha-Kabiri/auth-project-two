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

  async getAllUsers(req, res, next) {
    try {
      let users = await Users.find({});
      res.render("user", {
        users: users,
        title: "همه کاربران ",
        errors: req.flash("errors"),
        message: req.flash("message"),
      });
    } catch (err) {
      next(err);
    }
  }
  async seeOneUser(req, res, next) {
    try {
      let user = await Users.findById(req.params.id);

      res.render("update-user", { user: user });
    } catch (err) {
      next(err);
    }
  }

  async creatUser(req, res, next) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        req.flash("errors", error.array());
        return res.redirect("/api/user");
      }

      console.log(req.body);
      req.body.id = parseInt(req.body.id);
      let newUser = await new Users({
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      req.flash("message", "User created successfully.");
      res.redirect("/api/user");
    } catch (err) {
      next(err);
    }
  }
  async updateUser(req, res, next) {
    try {
      const users = await Users.updateOne(
        { _id: req.params.id },
        { $set: req.body }
      );
    } catch (err) {
      next(err);
    }
    req.flash("message", "user update is Successflly");
    res.redirect("/api/user");
  }
  async deleteUser(req, res, next) {
    try {
      await Users.deleteOne({ _id: req.params.id });

      req.flash("message", " user deleted is Successflly");
      res.redirect("/api/user");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
