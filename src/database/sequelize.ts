import { Sequelize } from "sequelize";
import { env } from "../config";

const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: env.DB_TYPE,
  pool: {
    max: 30, // Maximum number of connections in the pool
    min: 5, // Minimum number of connections in the pool
    acquire: 30000, // The maximum time (in ms) the pool will try to get a connection before throwing an error
    idle: 10000, // The maximum time (in ms) that a connection can be idle before being released
  },
  retry: {
    max: 3, // Retry failed queries up to 3 times
  },
  logging: !env.PRODUCTION ? console.log : true,
  ...(env.PRODUCTION
    ? {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // This disables certificate validation
        },
      },
    }
    : {}),
});


export default sequelize;
