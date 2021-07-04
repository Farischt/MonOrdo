import Backend from "@/server/index"
import Database from "@/server/database"
import EmailService from "@/server/mails/index"

export default async (req, res) => {
  if (req.method === "PATCH") {
    if (!(await Backend.isAuthenticatedUserAdmin({ req, res }))) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    }

    const { id } = req.query

    const doctor = await Database.Doctor.findByPk(id)
    if (!doctor) {
      res.statusCode = 404
      return res.json({ error: "not_found" })
    }

    doctor.verified = true
    await doctor.save()
    await EmailService.sendDoctorVerified(doctor.email, doctor.first_name)

    res.statusCode = 200
    res.json({ succes: true })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
