// backend/routes/authRoutes.js

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate"); // Middleware to verify JWT

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc  Register a new user
 */
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc  Authenticate user and return JWT
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  validate,
  authController.login
);

/**
 * @route GET /api/auth/me
 * @desc  Get authenticated user's profile
 * @access Protected
 */
router.get("/me", authenticate, authController.getUserProfile);

module.exports = router;
