import { Sequelize, DataTypes, Model } from "sequelize"
import bcryptjs from "bcryptjs"
import Database from "@/server/database"

const SALT_ROUND = 10

class Doctor extends Model {
  static async get(id) {
    return id && (await Doctor.findByPk(id))
  }

  static async emailTaken(email) {
    return email && (await Doctor.findOne({ where: { email } })) ? true : false
  }

  static async rppsTaken(rpps) {
    return rpps && (await Doctor.findOne({ where: { rpps } })) ? true : false
  }

  async getDoctorPrescriptions() {
    return await Database.Prescription.findAll({
      where: { prescripted_by: this.id },
    })
  }

  async checkPassword(password) {
    return (
      this.password !== null &&
      (await bcryptjs.compare(password, this.password))
    )
  }

  async setPassword(password) {
    this.password =
      password !== null && password !== undefined
        ? await bcryptjs.hash(password, SALT_ROUND)
        : null
  }
}

export default (sequelize, Asset) =>
  Doctor.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      pharmacist: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      rpps: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [11, 11],
        },
      },

      identity_card: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: {
          model: Asset,
          key: "id",
        },
      },

      doctor_card: {
        type: Sequelize.UUID,
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: {
          model: Asset,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Doctor",
    }
  )
