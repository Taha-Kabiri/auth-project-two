const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const path = require('path')

// controllers ------------------------------------------------------------------------

const dashbordController = require("../controllers/dashbordController");

// ------------------------------------------------------------------------------------
const uploadporfileuser = require('./../upload/upload-profile-user.js');

// This middleware checks if the user is authenticated.
// If NOT authenticated, it redirects them to the login page.
router.use((req, res, next) => {
  // Check if user is NOT authenticated
  if (!req.isAuthenticated()) {
    return res.redirect("/api/auth/login"); // Redirect to login if not authenticated
  }
  next(); // If authenticated, continue to the route handler
});

router.get("/", dashbordController.index.bind(dashbordController));


router.post(
  "/edituser",uploadporfileuser.single('img'),
  [body("firstname", "Write your name, Martike").not().isEmpty(),
    body("img" ).custom(async value=>{
      if(!value){
        return
      }
      if(['.jpg' , 'jpeg' , '.png'].includes(path.extname(value))){
        throw new Error('The extension of the imported image is not correct.')
      }
    })
     ],
    ((req,res,next)=>{
      if(!req.file){
        req.body.img = null
      }else{
        req.body.img=req.filename;
      }
      next()
    }),
  dashbordController.edituser.bind(dashbordController)
);

module.exports = router;
