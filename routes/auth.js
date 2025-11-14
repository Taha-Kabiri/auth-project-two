const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// controllers ------------------------------------------------------------------------

const authController = require("../controllers/authController");


router.get("/login", authController.loginForm.bind(authController));
router.get("/register", authController.registerForm.bind(authController));

router.post("/login",[
    body("email", "Enter your email.").isEmail(),
    body("password", "The minimum password characters are 5 ").isLength({
      min: 5,
    }),
  ], authController.login.bind(authController));
router.post("/register",[
    body("email", "Enter your email.").isEmail(),
    body("password", "The minimum password characters are 5 ").isLength({
      min: 5,
    }),
    body("firstname", "Write your name, Martike.").not().isEmpty().isLength({ min: 2 }),
  ], authController.register.bind(authController));


module.exports = router;
