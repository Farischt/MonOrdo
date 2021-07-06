import Backend from "@/server/index"
import Database from "@/server/database"

export default async (req, res) => {
  if (req.method === "PATCH") {
    const user = await Backend.getAuthenticatedUser({ req, res })
    if (!user) {
      res.statusCode = 401
      return res.json({ error: "unauthorized" })
    } else if (!user.pharmacist) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    }

    let { prescriptionId } = req.query

    if (typeof prescriptionId !== "string") {
      res.statusCode = 400
      return res.json({ error: "bad_request" })
    }

    const prescription = await Database.Prescription.findByPk(prescriptionId)
    if (!prescription) {
      res.statusCode = 404
      return res.json({ error: "not_found" })
    }

    if (prescription.expired) {
      res.statusCode = 400
      return res.json({ error: "expired_prescription" })
    } else if (Date.now() >= new Date(prescription.expiration_date).getTime()) {
      prescription.expired = true
      await prescription.save()
      res.statusCode = 400
      return res.json({ error: "expired_prescription" })
    } else if (prescription.max_use === prescription.used) {
      prescription.expired = true
      await prescription.save()
      res.statusCode = 400
      return res.json({ error: "expired_prescription" })
    }

    await prescription.increment("used")
    await prescription.reload()

    if (prescription.max_use === prescription.used) {
      prescription.expired = true
    }

    await prescription.save()
    res.statusCode = 200
    res.json({ succes: true, ...prescription })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
