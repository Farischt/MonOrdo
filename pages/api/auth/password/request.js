import Database from "@/server/database"
import EmailService from "@/server/mails/index"
import { Op } from "sequelize"

export default async (req, res) => {
  if (req.method === "POST") {
    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    }

    const user = await Database.User.findOne({
      where: { email: req.body.email },
    })
    if (!user) {
      res.statusCode = 400
      return res.json({ error: "invalid_email" })
    } else if (!user.verified) {
      res.statusCode = 400
      return res.json({ error: "invalid_email" })
    }

    const token = await Database.PasswordResetToken.findOne({
      where: {
        user_id: user.id,
        createdAt: {
          [Op.gte]: Date.now() - 60 * 1000,
        },
      },
    })

    if (token) {
      res.statusCode = 400
      return res.json({ error: "already_sent" })
    }

    await Database.PasswordResetToken.destroy({
      where: {
        user_id: user.id,
      },
    })

    const newToken = await Database.PasswordResetToken.create({
      user_id: user.id,
    })

    await EmailService.sendPasswordResetRequest(user.email, newToken.token)

    res.json({ succes: true })
  } else {
    res.statusCode = 405
    return res.json({ error: "method_not_allowed" })
  }
}
