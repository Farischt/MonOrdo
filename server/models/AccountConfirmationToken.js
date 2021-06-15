import { Sequelize, DataTypes, Model } from "sequelize"

class AccountConfirmationToken extends Model {}

export default (sequelize, User) =>
  AccountConfirmationToken.init(
    {
      token: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "AccountConfirmationToken",
    }
  )
