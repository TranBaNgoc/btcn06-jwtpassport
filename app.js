var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const passport = require("passport");
var user = require("./routes/user");
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/user", passport.authenticate("jwt", { session: false }), user);

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
  res.send(req.user);
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Express is running on port 3000");
});
