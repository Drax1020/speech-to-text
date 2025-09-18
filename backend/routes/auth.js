const express = require("express");
const passport = require("passport");
const { signup, login } = require("../controllers/authController");
const generateToken = require("../utils/generationToken");

const router = express.Router();

// Email auth
router.post("/signup", signup);
router.post("/login", login);

// Google OAuth start
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

module.exports = router;
