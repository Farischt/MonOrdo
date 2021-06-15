import Backend from "@/server/index"

export default async (req, res) => {
  if (req.method === "POST") {
    if (!(await Backend.getAuthenticatedUser({ req, res }))) {
      res.statusCode = 401
      return res.json({ error: "not_authenticated" })
    }

    await Backend.logout({ req, res })
    res.statusCode = 200
    res.json({ success: true })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
