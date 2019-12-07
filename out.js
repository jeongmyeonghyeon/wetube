"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 4000;

function handleListening() {
  console.log("Listening on: http://localhost:".concat(PORT));
}

function handleHome(req, res) {
  res.send('Hello from Home');
}

var handleProfile = function handleProfile(req, res) {
  res.send('You are on my profile');
};

app.get("/", handleHome);
app.get('/profile', handleProfile);
app.listen(PORT, handleListening);
