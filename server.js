const express = require("express");
const app = express();
const methodOverride = require("method-override");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
require("dotenv").config();

global.config = require("./config/config.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/nodestart")
  .then(() => console.log("Connected!"))
  .catch((e) => console.error(e));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(methodOverride("method"));

app.use(cookieparser(process.env.cookiparser_key));
app.use(
  session({
    secret: process.env.session_key,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use("/api/user", require("./routes/user.js"));

app.listen(config.port, () => {
  console.log(`server running on port ${config.port} `);
});
