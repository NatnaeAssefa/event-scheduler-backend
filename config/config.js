// config/config.js
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    ...(process.env.PRODUCTION === "true"
      ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // This disables certificate validation
          },
        },
      }
      : {}),
  },
};
