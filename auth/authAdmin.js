const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/Admin");

//Create a passport middleware to handle user registration
passport.use(
  "registerAdmin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        console.log("Admin Registered: " + email);
        const name = req.body.name;
        const mobileNo = req.body.mobileNo;
        const organization = req.body.organization;
        const position = req.body.position;
        const location = req.body.location;
        //Save the information provided by the user to the the database
        const user = await UserModel.create({
          name,
          email,
          password,
          mobileNo,
          organization,
          position,
          location,
        });
        //Send the user information to the next middleware
        return done(null, user);
      } catch (error) {
        error.msg = "";
        if (error.code === 11000) {
          error.msg = "Email already exists";
        }
        console.log(error.msg);
        done(null, false, { email: error.msg });
      }
    }
  )
);

//Create a passport middleware to handle User login
passport.use(
  "loginAdmin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { emailnotfound: "Email not found" });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { passwordincorrect: "Password incorrect" });
        }
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        console.log(error.msg);
        return done(error);
      }
    }
  )
);

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "jwtAdmin",
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: process.env.secretOrKey,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromHeader("authorization"),
    },
    async (token, done) => {
      try {
        //console.log(token)
        //Pass the user details to the next middleware
        return done(null, token);
      } catch (error) {
        console.log(error.msg);
        done(error);
      }
    }
  )
);
