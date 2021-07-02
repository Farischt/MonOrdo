import Backend from "@/server/index"
import Database from "@/server/database"

export default async (req, res) => {
  if (req.method === "GET") {
    if (!(await Backend.isAuthenticatedUserAdmin({ req, res }))) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    } else if (req.query.page && isNaN(parseInt(req.query.page))) {
      res.statusCode = 400
      return res.json({ error: "bad_request" })
    } else if (parseInt(req.query.page) < 1) {
      res.statusCode = 400
      return res.json({ error: "bad_request" })
    }

    let perPage = process.env.PER_PAGE
    let actualPage = req.query.page ? parseInt(req.query.page) - 1 : 0

    const doctors = await Database.Doctor.findAll({
      where: { verified: false },
      order: [["created_at", "DESC"]],
      limit: perPage,
      offset: perPage * actualPage,
    })

    if (!doctors.length) {
      res.statusCode = 404
      return res.json({ error: "not_found" })
    }

    res.json(doctors)
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
