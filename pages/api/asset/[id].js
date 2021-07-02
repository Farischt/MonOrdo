import Backend from "@/server/index"
import Database from "@/server/database"

export default async (req, res) => {
  const asset = await Database.Asset.findByPk(req.query.id)
  if (!asset) {
    res.statusCode = 404
    return res.send()
  } else if (asset.private) {
    const user = await Backend.getAuthenticatedUser({ req, res })
    if (!user || !user.admin) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    }
  }

  //TODO: Handle the case where the doctor wants to see his own documents

  res.statusCode = 200
  res.setHeader("Content-Type", asset.mime_type)
  res.send(asset.content)
}
