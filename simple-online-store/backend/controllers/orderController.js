const { Order, Cart, Product, OrderItem } = require("../models");

exports.placeOrder = async (req, res) => {
  try {
    console.log("🛒 Placing order for user:", req.user.id);

    // Fetch cart items
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Product, attributes: ["id", "name", "price", "stock"] },
      ],
    });

    if (!cartItems.length) {
      console.warn("⚠️ Cart is empty, cannot place order.");
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    let orderItems = [];

    for (let item of cartItems) {
      if (!item.Product) {
        console.error(`❌ Product not found for cart item ${item.id}`);
        return res.status(500).json({ message: "Product not found" });
      }
      totalPrice += item.Product.price * item.quantity;
      orderItems.push({
        productId: item.Product.id,
        quantity: item.quantity,
        price: item.Product.price,
      });
    }

    console.log("📦 Creating new order...");

    // ✅ Ensure we use `totalPrice` instead of `total`
    const newOrder = await Order.create({
      userId: req.user.id,
      total: totalPrice, // ✅ Match the field name in the database
      status: "pending",
    });

    console.log("✅ Order created successfully:", newOrder.id);

    // Clear cart
    await Cart.destroy({ where: { userId: req.user.id } });

    return res.status(201).json({
      message: "✅ Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            include: [{ model: Product, attributes: ["name", "price"] }],
          },
        ],
      });
    } else {
      orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: OrderItem,
            include: [{ model: Product, attributes: ["name", "price"] }],
          },
        ],
      });
    }

    return res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching order history:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch order history", error });
  }
};
