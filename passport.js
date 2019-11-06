const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

const UserModel = require("./models/users.model");
const configAuth = require("./config");

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

passport.use(
  new FacebookStrategy(
    {
      // điền thông tin để xác thực với Facebook.
      // những thông tin này đã được điền ở file auth.js
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: [
        "id",
        "displayName",
        "email",
        "first_name",
        "last_name",
        "middle_name"
      ]
    },

    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function(token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
        // tìm trong db xem có user nào đã sử dụng facebook id này chưa
        User.findOne({ "facebook.id": profile.id }, function(err, user) {
          if (err) return done(err);

          // Nếu tìm thấy user, cho họ đăng nhập
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // nếu chưa có, tạo mới user
            var newUser = new User();

            // lưu các thông tin cho user
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name =
              profile.name.givenName + " " + profile.name.familyName; // bạn có thể log đối tượng profile để xem cấu trúc
            newUser.facebook.email = profile.emails[0].value; // fb có thể trả lại nhiều email, chúng ta lấy cái đầu tiền

            // lưu vào db
            // newUser.save(function(err) {
            //   if (err) throw err;
            //   // nếu thành công, trả lại user
            //   return done(null, newUser);
            // });
          }
        });
      });
    }
  )
);
