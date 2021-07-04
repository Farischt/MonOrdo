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

    const doctor = await Database.Doctor.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (!doctor) {
      res.statusCode = 401
      return res.json({ error: "invalid_credentials" })
    } else if (!doctor.verified) {
      res.statusCode = 401
      return res.json({ error: "invalid_credentials" })
    } else if (!(await doctor.checkPassword(req.body.password))) {
      res.statusCode = 401
      return res.json({ error: "invalid_credentials" })
    }

    const token = await Database.AuthToken.create({
      doctor_id: doctor.id,
    })

    await Backend.login({ req, res }, token.token)

    res.statusCode = 200
    res.json({
      loggedIn: true,
      email: doctor.email,
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      verified: doctor.verified,
      rpps: doctor.rpps,
      pharmacist: doctor.pharmacist,
    })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
