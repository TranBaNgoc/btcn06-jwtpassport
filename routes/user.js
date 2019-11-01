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
        error: "Đăng nhập thất bại",
        user: user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.status(400).send(err);
      }

      var entity = { username: user.username, displayname: user.displayname };
      const token = jwt.sign(JSON.stringify(entity), "your_jwt_secret");
      return res.status(200).json({ user: entity , token});
    });
  })(req, res);
});

router.post("/register", function(req, res, next) {
  var entity = {
    username: req.body.username,
    password: req.body.password,
    displayname: req.body.displayname
  };

  UserModels.single(entity.username).then(row => {
    if (row.length === 0) {
      UserModels.add(entity).then(() => {
        res.status(200).json({ username: entity.username });
      });
    } else {
      res.status(400).json({ error: "Đăng ký thất bại, tài khoản đã tồn tại" });
    }
  });
});

router.post("/profile", function(req, res, next) {
  var entity = {
    username: req.body.username,
    password: req.body.password,
    displayname: req.body.displayname
  };

  UserModels.single(entity.username).then(row => {
    if (row.length != 0) {
      UserModels.update(entity).then(() => {
        res.status(200).json({ username: entity.username });
      });
    } else {
      res.status(400).json({ error: "Cập nhật thất bại" });
    }
  });
})

module.exports = router;
