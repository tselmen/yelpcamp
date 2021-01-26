const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {register, registerPost, login, loginPost, logout} = require("../controllers/users")

router.get("/register", register);
router.post("/register", catchAsync(registerPost));
router.get("/login", login);
router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login",}), catchAsync(loginPost));
router.get("/logout", logout);

module.exports = router;
