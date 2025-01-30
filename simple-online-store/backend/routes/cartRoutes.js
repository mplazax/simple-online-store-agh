const express = require("express");
const cartController = require("../controllers/cartController");
const authenticate = require("../middleware/authenticate");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * @route POST /api/cart
 * @desc  Add item to cart
 */
router.post(
  "/",
  authenticate,
  [body("productId").isInt(), body("quantity").isInt({ min: 1 })],
  validate,
  cartController.addToCart
);

/**
 * @route GET /api/cart
 * @desc  Get all items in user's cart
 */
router.get("/", authenticate, cartController.getCartItems);

/**
 * @route DELETE /api/cart/:id
 * @desc  Remove an item from cart
 */
router.delete("/:id", authenticate, cartController.removeCartItem);

module.exports = router;
