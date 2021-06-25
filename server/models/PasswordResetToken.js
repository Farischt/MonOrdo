import { Sequelize, Model, DataTypes } from "sequelize"
import Database from "@/server/database"

class PasswordResetToken extends Model {
  async getUser() {
    return await Database.User.findOne({ where: { id: this.id } })
  }
}

export default (sequelize, User) =>
  PasswordResetToken.init(
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
      modelName: "PasswordResetToken",
    }
  )
