import { DataTypes, Model } from "sequelize"
import bcryptjs from "bcryptjs"

const SALT_ROUND = 10

class Doctor extends Model {
  static async get(id) {
    return id && (await Doctor.findByPk(id))
  }

  static async emailTaken(email) {
    return email && (await Doctor.findOne({ where: { email } })) ? true : false
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

export default (sequelize) =>
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

      //   social_security: {
      //     type: DataTypes.STRING,
      //     allowNull: false,
      //     unique: true,
      //     validate: {
      //       len: [13, 13],
      //     },
      //   },

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
    },
    {
      sequelize,
      modelName: "Doctor",
    }
  )
