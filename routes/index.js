var express = require('express');
var router = express.Router();

const checkToken = (req, res, next) => {
  console.log(req.header);
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};

/* GET user profile. */
router.get("/me", checkToken, function(req, res, next) {
  res.json(req.user);
});

module.exports = router;