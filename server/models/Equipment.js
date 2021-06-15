import { Sequelize, DataTypes, Model } from "sequelize"

class Equipment extends Model {}

export default (sequelize, User) =>
  Equipment.init(
    {
      token: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      supplier: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      loaned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
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
      modelName: "Equipment",
    }
  )
