import axios from "axios"
import { API_URL } from "./config.json"

class AuthApi {
  constructor() {
    this.END_POINT = "auth"
  }

  async register(userInformations) {
    return await axios.post(
      `${API_URL}/${this.END_POINT}/register`,
      userInformations
    )
  }

  async login(userCredentials) {
    return await axios.post(
      `${API_URL}/${this.END_POINT}/login`,
      userCredentials
    )
  }

  async getAuthenticatedUser() {
    return await axios.get(`${API_URL}/${this.END_POINT}/me`)
  }

  async logout() {
    return await axios.post(`${API_URL}/${this.END_POINT}/logout`)
  }
}

export default new AuthApi()
