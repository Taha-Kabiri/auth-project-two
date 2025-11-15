const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./../model/user");

passport.serializeUser( async (user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await User.findById(id);
  if (user) done(null, user);
});

//----- Stratege------register-------------------------------------------------

passport.use(
  "local.register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return done(
            null,
            false,
            req.flash("errors", "Email already exists.")
          );
        }
        const newUser = new User({
          firstname: req.body.firstname,
          email: req.body.email,
          password: req.body.password,
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false, { message: errors });
      }
    }
  )
);

//----- Stratege------login-------------------------------------------------

passport.use(
  "local.login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // SYNTAX FIX: Removed 'new' before User.findOne
        let user = await User.findOne({ email: req.body.email });
        if (!user || user.password != req.body.password) {
          return done(
            null,
            false,
            req.flash("errors", "The information does not match.")
          );
        }
        done(null, user);
      } catch (err) {
        // FIX: Changed 'return done' to 'done' and ensured correct flash message
        done(err, false, req.flash("errors", "An error occurred during login."));
      }
    }
  )
);