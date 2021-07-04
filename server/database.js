import { Sequelize } from "sequelize"
import Models from "./models/index"
import { DATABASE_CREDENTIALS } from "./config"

const sequelize = new Sequelize(
  Object.assign(
    {
      define: {
        underscored: true,
      },
      logging: false,
    },
    DATABASE_CREDENTIALS
  )
)

const models = Models(sequelize)
const sync = false

;(async () => {
  if (sync) {
    console.log("Syncronizing all models")
    await sequelize.sync({ force: true })
    console.log("All models syncronized")
  }
  // await models.Prescription.sync({ force: true })
  // await models.Doctor.sync({ force: true })
})()

export default { sequelize, ...models }
