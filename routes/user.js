const express = require("express");
const router = express.Router();
let Users = require("./../model/user");
const { body, validationResult } = require("express-validator");

// controllers ------------------------------------------------------------------------

const UserController = require("../controllers/userController");

router.get("/", UserController.getAllUsers.bind(UserController));

router.get("/:id", UserController.seeOneUser.bind(UserController));

router.post(
  "/",
  [
    body("email", "Enter your email.").isEmail(),
    body("password", "The minimum password characters are 5 ").isLength({
      min: 5,
    }),
    body("firstname", "Write your name, Martike.").isLength({ min: 2 }),
  ],
  UserController.creatUser.bind(UserController)
);

router.put("/:id", UserController.updateUser.bind(UserController));

router.delete("/:id", UserController.deleteUser.bind(UserController));

module.exports = router;
