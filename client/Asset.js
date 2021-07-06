import { API_URL } from "./config.json"

class AssetApi {
  constructor() {
    this.ASSET_URI = "asset"
  }

  getEncoded(assetId) {
    return `${API_URL}/${this.ASSET_URI}/${encodeURIComponent(assetId)}`
  }
}

export default new AssetApi()
