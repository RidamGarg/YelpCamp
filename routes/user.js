const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controller/user");
const passport = require("passport");
router.route("/register").get(users.renderRegister).post(users.Register);
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/signin",
    }),
    users.Login
  ); //passport function helps in authenticate user at local,it can be goggle or tweeter.
router.get("/logout", users.Logout);
// Extra Apis
router.get("/api/line-chart-data", (req, res) => {
  const data = [
    { name: "", react: 32, angular: 37, vue: 60 },
    { name: "Week 1", react: 32, angular: 37, vue: 60 },
    { name: "Week 2", react: 42, angular: 42, vue: 54 },
    { name: "Week 3", react: 51, angular: 41, vue: 54 },
    { name: "Week 4", react: 60, angular: 37, vue: 28 },
  ];
  res.send(data);
});
router.get("/api/pie-chart-data", (req, res) => {
  const data = [
    {
      id: 1,
      title: "Basic Tees",
      userGain: 80000,
      userLost: 823,
    },
    {
      id: 2,
      title: "Custom Short Pants",
      userGain: 45677,
      userLost: 345,
    },
    {
      id: 3,
      title: "Super Hoodies",
      userGain: 78888,
      userLost: 555,
    },
  ];
  res.send(data);
});
module.exports = router;
