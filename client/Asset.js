import { API_URL } from "./config.json"

class AssetsApi {
  getEncoded(assetId) {
    return `${API_URL}/asset/${encodeURIComponent(assetId)}`
  }
}

export default new AssetsApi()
