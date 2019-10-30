const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

const UserModel = require("./models/users.model");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(username, password, cb) {
      //Assume there is a DB module pproviding a global UserModel
      return UserModel.single(username)
        .then(user => {
          if (user.length === 0) {
            return cb(null, false, { error: "Sai tài khoản hoặc mật khẩu." });
          } else {
            if (user[0].password !== password) {
              return cb(null, false, {
                error: "Sai tài khoản hoặc mật khẩu."
              });
            } else {
              return cb(null, user[0], {
                message: "Đăng nhập thành công"
              });
            }
          }
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret"
    },
    function(jwtPayload, cb) {
      //find the user in db if needed
      return UserModel.single(jwtPayload.username)
        .then(row => {
          return cb(null, row[0]);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);
