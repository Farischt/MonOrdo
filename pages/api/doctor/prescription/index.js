import Backend from "@/server/index"
import Database from "@/server/database"

export default async (req, res) => {
  if (req.method === "POST") {
    const doctor = await Backend.getAuthenticatedUser({ req, res })
    if (!doctor.rpps || doctor.pharmacist) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    }

    if (
      typeof req.body.patient_social_code !== "string" ||
      isNaN(parseInt(req.body.patient_social_code))
    ) {
      res.statusCode = 400
      return res.json({ error: "missing_patient_id" })
    } else if (typeof req.body.expiration_date !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_expiration_date" })
    } else if (typeof req.body.reusable !== "boolean") {
      res.statusCode = 400
      return res.json({ error: "missing_reusability" })
    } else if (typeof req.body.max_use !== "number" || req.body.max_use < 1) {
      res.statusCode = 400
      return res.json({ error: "missing_max_use" })
    } else if (
      req.body.content instanceof Array !== true ||
      !req.body.content.length
    ) {
      res.statusCode = 400
      return res.json({ error: "missing_content" })
    }

    for (let i = 0; i < req.body.content.length; i++) {
      if (typeof req.body.content[i] !== "string") {
        res.statusCode = 400
        return res.json({ error: "invalid_content_type" })
      }
    }

    const { patient_social_code, expiration_date, content, reusable } = req.body
    const max_use = parseInt(req.body.max_use)

    const patient = await Database.User.findOne({
      where: {
        social_security: patient_social_code,
      },
    })

    if (!patient) {
      res.statusCode = 404
      return res.json({ error: "patient_not_found" })
    } else if (!patient.verified) {
      res.statusCode = 400
      return res.json({ error: "bad_request" })
    }

    await Database.Prescription.create({
      prescripted_by: doctor.id,
      prescripted_for: patient.id,
      expiration_date,
      reusable,
      max_use,
      content,
    })

    res.statusCode = 200
    res.json({ succes: true })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
