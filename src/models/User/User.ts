import { DataTypes, Model, Sequelize } from "sequelize";
import { UserStatus, UserType } from "../../utilities/constants/Constants";

export class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public first_name!: string;
  public last_name!: string;
  public status!: string;
  public type?: string;
  public role_id?: string;
  public last_used_key?: string;
  public verification_code?: string;
  public verification_time?: Date;
  public is_verified?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: UserStatus.PENDING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(UserType)),
        allowNull: true,
        set(value) {
          if (this.isNewRecord) {
            this.setDataValue("type", value);
          }
        },
      },
      last_used_key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: "user",
      tableName: "users",
    }
  );
};