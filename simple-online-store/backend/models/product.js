"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Define associations here.
     * This method is called automatically by Sequelize.
     */
    static associate(models) {
      Product.hasMany(models.Cart, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      Product.hasMany(models.Review, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: "productId",
        otherKey: "orderId",
      });
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "SET NULL", // Adjust based on your business logic
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image_url: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      categoryId: {
        // Changed from 'category' to 'categoryId'
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onDelete: "SET NULL", // Or 'CASCADE'
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
      },
      rating_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
    }
  );

  return Product;
};
