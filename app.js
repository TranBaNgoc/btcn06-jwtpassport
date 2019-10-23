var express = require("express");
var bodyParser = require("body-parser");
const passport = require("passport");
var user = require("./routes/user");
var index = require("./routes/index");
require('./passport');
var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  
  // allow options method work, ask experts for more
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
}
app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", user);
app.use("/", passport.authenticate('jwt', {session: false}), index)


app.listen(process.env.PORT || 3000, function() {
  console.log("Express is running on port 3000");
});
