import axios from "axios"
import { API_URL } from "./config.json"

const END_POINT = "auth"

class AuthApi {
  async register(userInformations) {
    return await axios.post(
      `${API_URL}/${END_POINT}/register`,
      userInformations
    )
  }

  async login(userCredentials) {
    return await axios.post(`${API_URL}/${END_POINT}/login`, userCredentials)
  }

  async getAuthenticatedUser() {
    return await axios.get(`${API_URL}/${END_POINT}/me`)
  }

  async logout() {
    return await axios.post(`${API_URL}/${END_POINT}/logout`)
  }
}

export default new AuthApi()
