const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
/*
router.all("*", (req, res, next) => {
  try {
    let err = new Error(" چنین صفحه ای پیدا نشد ");
    err.statuse = 404;
    throw err;
  } catch (err) {
    next(err);
  }
});*/

module.exports = router;
