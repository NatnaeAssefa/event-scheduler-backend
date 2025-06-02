import { Sequelize } from "sequelize";
import EventModel from "./Event";
import { Event } from "./Event";
import { User } from "../User/User";

export default (sequelize: Sequelize) => {
  EventModel(sequelize);

  Event.belongsTo(User, {
    foreignKey: "user_id",
  });

  User.hasMany(Event, {
    foreignKey: "user_id",
  });
}; 