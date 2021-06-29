import axios from "axios"
import { API_URL } from "./config.json"

class AdminApi {
  constructor() {
    this.AUTH_END_POINT = "auth"
    this.ADMIN_END_POINT = "admin"
  }

  //! AUTHENTICATION

  async login(credentials) {
    return await axios.post(
      `${API_URL}/${this.AUTH_END_POINT}/${this.ADMIN_END_POINT}/login`,
      credentials
    )
  }

  //! PASSWORD

  //! CREATE ADMIN
}

export default new AdminApi()
