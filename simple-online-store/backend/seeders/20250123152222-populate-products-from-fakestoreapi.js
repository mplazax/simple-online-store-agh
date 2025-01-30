"use strict";

const axios = require("axios");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Fetch products from FakeStoreAPI
      const response = await axios.get("https://fakestoreapi.com/products");
      const products = response.data;

      // Fetch categories from the database
      const categories = await queryInterface.sequelize.query(
        `SELECT id, name FROM "Categories";`
      );

      const categoryRows = categories[0];

      // Create a mapping from category name to id
      const categoryMap = {};
      categoryRows.forEach((category) => {
        categoryMap[category.name] = category.id;
      });

      // Map the fetched products to match your Product model, assigning categoryId
      const formattedProducts = products.map((product) => ({
        name: product.title,
        description: product.description,
        price: product.price,
        stock: Math.floor(Math.random() * 100) + 1, // Assigning random stock between 1-100
        image_url: product.image,
        categoryId: categoryMap[product.category] || null, // Assign categoryId based on category name
        rating: product.rating.rate,
        rating_count: product.rating.count,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Bulk insert the products into the Products table
      await queryInterface.bulkInsert("Products", formattedProducts, {});
      console.log("Products have been successfully seeded.");
    } catch (error) {
      console.error("Error seeding products:", error);
      throw error; // Ensure the seeder fails if there's an error
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove all products inserted by this seeder
      await queryInterface.bulkDelete("Products", null, {});
      console.log("Products have been successfully removed.");
    } catch (error) {
      console.error("Error removing products:", error);
      throw error;
    }
  },
};
