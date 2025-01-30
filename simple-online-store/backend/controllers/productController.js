const { Product, Review, User } = require("../models"); // Ensure models are correctly imported

/**
 * Get all products
 */
exports.getProducts = async (req, res) => {
  try {
    // Implement search and filtering if needed
    const products = await Product.findAll();
    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

/**
 * Get a single product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          include: [
            {
              model: User,
              attributes: ["id", "email"], // Include user info in reviews
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

/**
 * Get all reviews for a specific product
 */
exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.id },
      include: [
        {
          model: User,
          attributes: ["email"], // Include user email
        },
      ],
    });

    if (!reviews) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};

/**
 * Create a new product (Admin only)
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      image_url,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

/**
 * Update an existing product (Admin only)
 */
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.image_url = image_url || product.image_url;

    await product.save();

    return res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

/**
 * Delete a product (Admin only)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};

/**
 * Add a review to a product (Authenticated users only)
 */
exports.addReview = async (req, res) => {
  try {
    console.log(req.body);
    const { rating, comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const productId = req.params.id;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({
      where: { productId, userId },
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Create the review
    const newReview = await Review.create({
      productId,
      userId,
      rating,
      comment,
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    return res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
};

/**
 * Update a review (Owner or Admin)
 */
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId, reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the review
    const review = await Review.findOne({
      where: { id: reviewId, productId: productId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner or an admin
    if (review.userId !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Update the review
    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment || review.comment;

    await review.save();

    return res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return res
      .status(500)
      .json({ message: "Failed to update review", error: error.message });
  }
};

/**
 * Delete a review (Owner or Admin)
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the review
    const review = await Review.findOne({
      where: { id: reviewId, productId: productId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner or an admin
    if (review.userId !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.destroy();

    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete review", error: error.message });
  }
};
