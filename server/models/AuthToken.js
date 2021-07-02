import { Sequelize, DataTypes, Model } from "sequelize"

class AuthToken extends Model {}

export default (sequelize, User, Doctor) =>
  AuthToken.init(
    {
      token: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: User,
          key: "id",
        },
      },

      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: Doctor,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "AuthToken",
    }
  )
