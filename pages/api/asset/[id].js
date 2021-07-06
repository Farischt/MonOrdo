import Backend from "@/server/index"
import Database from "@/server/database"

export default async (req, res) => {
  const asset = await Database.Asset.findByPk(req.query.id)
  if (!asset) {
    res.statusCode = 404
    return res.send()
  } else if (asset.private) {
    const user = await Backend.getAuthenticatedUser({ req, res })
    if (
      (user && user.doctor_card === asset.id) ||
      (user && user.identity_card === asset.id)
    ) {
      res.statusCode = 200
      res.setHeader("Content-Type", asset.mime_type)
      return res.send(asset.content)
    } else if (!user || !user.admin) {
      res.statusCode = 403
      return res.json({ error: "forbidden" })
    }
  }
  res.statusCode = 200
  res.setHeader("Content-Type", asset.mime_type)
  res.send(asset.content)
}
