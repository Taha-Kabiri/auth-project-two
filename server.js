const express = require("express");
const app = express();
const methodOverride = require("method-override");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
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
    cookie : {expires : new Date(Date.now() + 1000 * 3600 * 24 * 1)},
    store : MongoStore.create({
  client: mongoose.connection.getClient()
}),
  })
);

app.use(flash());

 require("./passport/passport-local");
app.use(passport.initialize());
app.use(passport.session()); 


app.use((req,res,next)=>{
  console.log(req.user);
  res.locals =  {errors : req.flash("errors") , req : req}
      next();
})
app.use("/", require("./routes/index.js"));

// after all routes
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not Found :/",
  });
});

app.listen(config.port, () => {
  console.log(`server running on port ${config.port} `);
});
