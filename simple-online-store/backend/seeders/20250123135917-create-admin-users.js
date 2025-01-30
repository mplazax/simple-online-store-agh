"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Define admin users
    const adminUsers = [
      {
        email: "mateuszjarosz@example.com",
        password: "AdminPass123!",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "michalplaza@example.com",
        password: "AdminPass456!",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "agnieszkamiroslaw@example.com",
        password: "AdminPass789!",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Hash passwords
    const hashedAdminUsers = await Promise.all(
      adminUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert admin users into the Users table
    return queryInterface.bulkInsert("Users", hashedAdminUsers, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove the inserted admin users
    return queryInterface.bulkDelete(
      "Users",
      {
        email: [
          "mateuszjarosz@example.com",
          "agnieszkamiroslaw@example.com",
          "michalplaza@example.com",
        ],
      },
      {}
    );
  },
};
