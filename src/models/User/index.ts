import { Sequelize } from "sequelize";
import UserFactory, { User } from "./User";

const UserModels = (sequelize: Sequelize) => {
  UserFactory(sequelize);
};

export default UserModels;
export { User };
