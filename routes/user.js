var express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
var router = express.Router();
var UserModels = require("../models/users.model");

/* POST login. */
router.post("/login", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err !== null || !user) {
      return res.status(400).json({
        message: "Đăng nhập thất bại",
        user: user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(JSON.stringify(user), "your_jwt_secret");
      return res.json({ user, token, message: "Đăng nhập thành công" });
    });
  })(req, res);
});

router.post("/register", function(req, res, next) {
  var entity = {
    username: req.body.username,
    password: req.body.password
  };

  UserModels.single(entity.username).then(row => {
    if (row.length === 0) {
      UserModels.add(entity).then(username => {
        res.json({ message: "Đăng ký thành công", username: username });
      });
    } else {
      res.json({ message: "Đăng ký thất bại, tài khoản đã tồn tại" });
    }
  });
});

router.get("/test", function(req, res, next) {
    console.log("test ok");
})

module.exports = router;
