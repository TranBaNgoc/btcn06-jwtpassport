var express = require("express");
var bodyParser = require("body-parser");
const passport = require("passport");
var user = require("./routes/user");
var index = require("./routes/index");
require("./passport");
var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

  // allow options method work, ask experts for more
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
};

app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", user);
app.use("/", passport.authenticate("jwt", { session: false }), index);

var server = require("http").createServer(app);
var io = require("socket.io")(server, {origins:'*:*'});

io.on('connection', socket => {
  console.log('New client connected')
  
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('AddMessage', (textMessage) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Message is: ', textMessage)
    socket.broadcast.emit('AddMessage', textMessage)
  })
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
});

app.listen(process.env.PORT || 4001, function() {
  console.log("Express is running on port ", process.env.PORT || 4001);
});
