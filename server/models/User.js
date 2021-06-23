import { DataTypes, Model } from "sequelize"
import bcryptjs from "bcryptjs"

const SALT_ROUND = 10

class User extends Model {
  static async get(id) {
    return id && (await User.findByPk(id))
  }

  static async emailTaken(email) {
    return email && (await User.findOne({ where: { email } })) ? true : false
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
  User.init(
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

      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )
