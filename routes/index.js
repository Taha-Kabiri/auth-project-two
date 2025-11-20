const express = require("express");
const homeController = require("../controllers/homeController");
const router = express.Router();

router.use("/api/user", require("./user"));
router.use("/api/auth", require("./auth"));
router.use("/api/dashbord", require("./dashbord"));
router.get("/api/homecallback" , homeController.paycallback.bind(homeController));
router.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
   
    res.redirect('/api/auth/register');
  });
});

module.exports = router;