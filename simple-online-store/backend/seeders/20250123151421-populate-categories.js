"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      { name: "men's clothing", description: "Apparel for men." },
      { name: "women's clothing", description: "Apparel for women." },
      { name: "jewelery", description: "Accessories and jewelry." },
      { name: "electronics", description: "Electronic gadgets and devices." },
      // Add more categories as needed
    ];

    const formattedCategories = categories.map((category) => ({
      name: category.name,
      description: category.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Categories", formattedCategories, {});
    console.log("Categories have been successfully seeded.");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
    console.log("Categories have been successfully removed.");
  },
};
