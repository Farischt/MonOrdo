import Database from "@/server/database"
import EmailService from "@/server/mails/index"

export default async (req, res) => {
  if (req.method === "POST") {
    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    } else if (typeof req.body.first_name !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_first_name" })
    } else if (typeof req.body.last_name !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_last_name" })
    } else if (typeof req.body.password !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    } else if (typeof req.body.repeatPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_repeat_password" })
    }

    if (await Database.User.emailTaken(req.body.email)) {
      res.statusCode = 400
      return res.json({ error: "email_taken" })
    }

    //? Password strength

    if (req.body.password !== req.body.repeatPassword) {
      res.statusCode = 400
      return res.json({ error: "passwords_are_not_the_same" })
    } else if (req.body.password.length < 8) {
      res.statusCode = 400
      return res.json({ error: "password_too_short" })
    } else if (!req.body.password.match(/[a-z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_lowercase_weakness" })
    } else if (!req.body.password.match(/[A-Z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_uppercase_weakness" })
    } else if (!req.body.password.match(/[0-9]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_number_weakness" })
    } else if (!req.body.password.match(/[^0-9a-zA-Z\s]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_special_weakness" })
    }

    const { email, first_name, last_name, password } = req.body
    const user = await Database.User.build({
      first_name,
      last_name,
      email,
    })

    //TODO : EmailService to send a verification

    await user.setPassword(password)
    await user.save()

    const token = await Database.AccountConfirmationToken.create({
      user_id: user.id,
    })

    await EmailService.sendAccountConfirmationMail(
      user.email,
      user.first_name,
      token.token
    )

    res.statusCode = 200
    res.json({ success: true })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
