const Controller = require("./controller");
let Users = require("./../model/user");
const { body, validationResult } = require("express-validator");
const { ApiHelpers, ApiError } = require("./helper");

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
      res.render("./../views/dashbord/index");
    } catch (err) {
      next(err);
    }
  }

  async edituser(req, res, next) {
    try {
        const error = validationResult(req);
      if (!error.isEmpty()) {
        req.flash("errors", error.array());
        return res.redirect("/api/dashbord")
      }

      console.log("Received Body:", req.body);
        console.log("User ID (req.body.id):", req.body.id);
        console.log("File Upload Status:", req.file ? "File received" : "No file");



        let data = {
          firstname : req.body.firstname
        }

        if(req.file){
          data.img = req.file.path.replace(/\\/g,"/").substring(6);
        }

        await Users.updateOne({_id : req.body.id} , {$set : data} );
        res.redirect('/api/dashbord');

    } catch (err) {
      next(err);
    }
  }
}

module.exports = new dashbordController();
