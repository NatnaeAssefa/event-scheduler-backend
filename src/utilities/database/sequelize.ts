import ModelSync from "../../models/index";
import sequelize from "../../database/sequelize";
import { Transaction } from "sequelize";
import LogService from "../../services/Log/Log.service";

export default () => {
  return new Promise((resolve, reject) => {
    ModelSync(sequelize);

    sequelize
      .sync({ logging: false, alter: false })
      .then(() => {
        LogService.LogInfo(
          "Database Connection has been established successfully."
        );
        resolve(true);
      })
      .catch((error: any) => {
        LogService.LogError(`Database connection error: ${error}`);
        reject(false);
      });

    resolve(true);
  });
};

export const createTransaction = (): Promise<Transaction> => {
  return new Promise(async (resolve, reject) => {
    sequelize
      .transaction()
      .then((transaction) => resolve(transaction))
      .catch((error) => reject(error));
  });
};
