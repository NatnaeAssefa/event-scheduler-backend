import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "../User/User";

export enum RecurrenceFrequency {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum WeekDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export class Event extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public start_date!: Date;
  public end_date!: Date;
  public recurrence_frequency!: RecurrenceFrequency;
  public recurrence_interval!: number;
  public recurrence_days!: number[];
  public recurrence_day_of_month!: number;
  public recurrence_week_of_month!: number;
  public recurrence_day_of_week!: number;
  public recurrence_end_date!: Date;
  public recurrence_count!: number;
  public is_all_day!: boolean;
  public location!: string;
  public color!: string;
  public user_id!: string;
  public user!: User;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default (sequelize: Sequelize) => {
  Event.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      recurrence_frequency: {
        type: DataTypes.ENUM(...Object.values(RecurrenceFrequency)),
        defaultValue: RecurrenceFrequency.NONE,
      },
      recurrence_interval: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      recurrence_days: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      recurrence_day_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      recurrence_week_of_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      recurrence_day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      recurrence_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      recurrence_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_all_day: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "event",
      tableName: "events",
    }
  );
}; 