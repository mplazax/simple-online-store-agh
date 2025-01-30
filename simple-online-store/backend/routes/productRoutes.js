const express = require("express");
const productController = require("../controllers/productController");
const authenticate = require("../middleware/authenticate");
const adminAuth = require("../middleware/adminAuth");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * @route GET /api/products
 * @desc  Get all products
 */
router.get("/", productController.getProducts);

/**
 * @route GET /api/products/:id
 * @desc  Get a single product
 */
router.get("/:id", productController.getProductById);

/**
 * @route GET /api/products/:id/reviews
 * @desc  Get all reviews for a product
 */
router.get("/:id/reviews", productController.getReviewsForProduct);

/**
 * @route POST /api/products
 * @desc  Create a product (Admin only)
 */
router.post(
  "/",
  authenticate,
  adminAuth,
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("description").optional().isString(),
    body("stock").optional().isInt({ min: 0 }),
    body("image_url").optional().isURL().withMessage("Image URL must be valid"),
  ],
  validate,
  productController.createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc  Update a product (Admin only)
 */
router.put(
  "/:id",
  authenticate,
  adminAuth,
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("description").optional().isString(),
    body("stock").optional().isInt({ min: 0 }),
    body("image_url").optional().isURL().withMessage("Image URL must be valid"),
  ],
  validate,
  productController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc  Delete a product (Admin only)
 */
router.delete("/:id", authenticate, adminAuth, productController.deleteProduct);

/**
 * @route POST /api/products/:id/reviews
 * @desc  Add a review (User must be authenticated)
 */
router.post(
  "/:id/reviews",
  authenticate,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").not().isEmpty().withMessage("Comment is required"),
  ],
  validate,
  productController.addReview
);

/**
 * @route PUT /api/products/:id/reviews/:reviewId
 * @desc  Update a review (Owner or Admin)
 */
router.put(
  "/:id/reviews/:reviewId",
  authenticate,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").not().isEmpty().withMessage("Comment is required"),
  ],
  validate,
  productController.updateReview
);

/**
 * @route DELETE /api/products/:id/reviews/:reviewId
 * @desc  Delete a review (Owner or Admin)
 */
router.delete(
  "/:id/reviews/:reviewId",
  authenticate,
  productController.deleteReview
);

module.exports = router;
