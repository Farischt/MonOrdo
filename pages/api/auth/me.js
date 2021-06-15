import Backend from "@/server/index"
// import Database from "@/server/database"

export default async (req, res) => {
  if (req.method === "GET") {
    const user = await Backend.getAuthenticatedUser({ req, res })
    if (!user) {
      res.statusCode = 401
      return res.json({ error: "not authenticated" })
    }
    res.statusCode = 200
    res.json({
      succes: true,
      email: user.email,
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
