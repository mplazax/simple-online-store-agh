const { Cart, Product, User } = require("../models"); // Ensure models are properly imported

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = await Cart.findOne({
      where: { userId: req.user.id, productId: productId },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json(existingItem);
    }

    const newCartItem = await Cart.create({
      userId: req.user.id,
      productId: productId,
      quantity,
    });

    return res.status(201).json(newCartItem);
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return res.status(500).json({ message: "Failed to add to cart", error });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    console.log("🔍 Fetching cart for user:", req.user.id);

    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Product, attributes: ["id", "name", "price", "image_url"] },
      ],
    });

    return res.json(cartItems);
  } catch (error) {
    console.error("❌ Error fetching cart items:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch cart items", error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });

    if (cartItem.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not allowed to remove this item" });
    }

    await cartItem.destroy();
    return res.json({ message: "Cart item removed" });
  } catch (error) {
    console.error("❌ Error removing cart item:", error);
    return res
      .status(500)
      .json({ message: "Failed to remove cart item", error });
  }
};
