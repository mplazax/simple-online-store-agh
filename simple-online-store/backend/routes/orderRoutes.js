const express = require("express");
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/**
 * @route POST /api/orders
 * @desc  Place an order from current cart items
 */
router.post("/", authenticate, orderController.placeOrder);

/**
 * @route GET /api/orders
 * @desc  Fetch order history
 */
router.get("/", authenticate, orderController.getOrderHistory);

module.exports = router;
