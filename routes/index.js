const express = require("express");
const router = express.Router();

router.use("/api/user", require("./user"));
router.use("/api/auth", require("./auth"));
router.use("/api/dashbord", require("./dashbord"));

router.get("/api/logout", async (req,res)=>{
  res.send('logout')
});

module.exports = router;
