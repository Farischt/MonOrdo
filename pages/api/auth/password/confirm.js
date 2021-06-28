import Database from "@/server/database"
import EmailService from "@/server/mails/index"

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    if (typeof req.body.resetToken !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_token" })
    } else if (typeof req.body.newPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    } else if (typeof req.body.repeatPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_repeat" })
    }

    //? Password strength

    if (req.body.newPassword !== req.body.repeatPassword) {
      res.statusCode = 400
      return res.json({ error: "passwords_are_not_the_same" })
    } else if (req.body.newPassword.length < 8) {
      res.statusCode = 400
      return res.json({ error: "password_too_short" })
    } else if (!req.body.newPassword.match(/[a-z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_lowercase_weakness" })
    } else if (!req.body.newPassword.match(/[A-Z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_uppercase_weakness" })
    } else if (!req.body.newPassword.match(/[0-9]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_number_weakness" })
    } else if (!req.body.newPassword.match(/[^0-9a-zA-Z\s]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_special_weakness" })
    }

    const token = await Database.PasswordResetToken.findByPk(
      req.body.resetToken
    )

    if (!token) {
      res.statusCode = 400
      return res.json({ error: "invalid_token" })
    } else if (token.createdAt < Date.now() - 60 * 60 * 1000) {
      res.statusCode = 400
      return res.json({ error: "expired_token" })
    }

    const user = await token.getUser()
    await user.setPassword(req.body.newPassword)
    await user.save()
    await token.destroy()

    // await EmailApi.sendPasswordChangeConfirmation(user.email, user.updatedAt)
    await EmailService.sendPasswordResetConfirmation(
      user.email,
      user.first_name,
      user.updatedAt
    )

    res.statusCode = 200
    res.json({
      succes: true,
    })
  } else {
    res.statusCode = 405
    return res.json({ error: "method not allowed" })
  }
}
