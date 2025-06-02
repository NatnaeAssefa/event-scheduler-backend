import { Sequelize } from "sequelize";
// import first
import UserModels from "./User";

import EventModels from "./Event";

export default (sequelize: Sequelize) => {
  UserModels(sequelize);
  EventModels(sequelize);
};
