const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// controllers ------------------------------------------------------------------------

const dashbordController = require("../controllers/dashbordController");

// This middleware checks if the user is authenticated.
// If NOT authenticated, it redirects them to the login page.
router.use((req , res , next)=>{
  // Check if user is NOT authenticated
  if(!req.isAuthenticated()){
    return res.redirect('/api/auth/login') // Redirect to login if not authenticated
  }
  next(); // If authenticated, continue to the route handler
});

router.get("/", dashbordController.index.bind(dashbordController));


module.exports = router;