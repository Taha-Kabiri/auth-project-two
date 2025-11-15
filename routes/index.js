const express = require("express");
const router = express.Router();

router.use("/api/user", require("./user"));
router.use("/api/auth", require("./auth"));
router.use("/api/dashbord", require("./dashbord"));

router.get("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
   
    res.redirect('/api/auth/register');
  });
});

module.exports = router;