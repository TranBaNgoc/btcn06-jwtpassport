var express = require("express");
var router = express.Router();
var UserModels = require("../models/users.model");


router.post("/register", function(req, res, next) {
  var entity = {
    username: req.body.username,
    password: req.body.password
  };

  UserModels.single(entity.username).then(row => {
      if (row.length === 0) {
          UserModels.add(entity).then(username => {
              res.json({message: "Đăng ký thành công", username: username});
          })
      } else {
          res.json({message: "Đăng ký thất bại, tài khoản đã tồn tại"});
      }
  })
});

module.exports = router;
