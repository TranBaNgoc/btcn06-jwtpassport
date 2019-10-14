var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const passport = require("passport");
var user = require("./routes/user");
var index = require("./routes/index");
require('./passport');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", user);
app.use("/", passport.authenticate('jwt', {session: false}), index)


app.listen(process.env.PORT || 3000, function() {
  console.log("Express is running on port 3000");
});
