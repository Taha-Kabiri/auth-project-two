const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// controllers ------------------------------------------------------------------------

const dashbordController = require("../controllers/dashbordController");


router.get("/", dashbordController.index.bind(dashbordController));


module.exports = router;
