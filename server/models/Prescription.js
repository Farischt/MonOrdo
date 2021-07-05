import { Sequelize, DataTypes, Model } from "sequelize"
import Database from "@/server/database"

class Prescription extends Model {
  async getDoctor() {
    return await Database.Doctor.findByPk(this.prescripted_by)
  }

  async getPatient() {
    return await Database.User.findByPk(this.prescripted_for)
  }
}

export default (sequelize, Doctor, User) =>
  Prescription.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      prescripted_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: Doctor,
          key: "id",
        },
      },

      prescripted_for: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: User,
          key: "id",
        },
      },

      expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      reusable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      max_use: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },

      used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },

      expired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      content: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Prescription",
    }
  )
