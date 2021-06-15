import Backend from "@/server/index"
import Database from "@/server/database"

export default async (req, res) => {
  if (req.method === "POST") {
    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    } else if (typeof req.body.password !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    }

    const user = await Database.User.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (!user) {
      res.statusCode = 401
      return res.json({ error: "invalid_credentials" })
    }
    // else if (!user.verified) {
    //   res.statusCode = 401
    //   return res.json({ error: "invalid_credentials" })
    // }
    else if (!(await user.checkPassword(req.body.password))) {
      res.statusCode = 401
      return res.json({ error: "invalid_credentials" })
    }

    const token = await Database.AuthToken.create({
      user_id: user.id,
    })

    await Backend.login({ req, res }, token.token)

    res.statusCode = 200
    res.json({
      loggedIn: true,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      admin: user.admin,
      verified: user.verified,
    })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
