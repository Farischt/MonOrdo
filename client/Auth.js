import axios from "axios"
import { API_URL } from "./config.json"

class AuthApi {
  constructor() {
    this.AUTH_URI = "auth"
  }

  //! USER AUTHENTICATION

  async register(userInformations) {
    return await axios.post(
      `${API_URL}/${this.AUTH_URI}/register`,
      userInformations
    )
  }

  async login(userCredentials) {
    return await axios.post(
      `${API_URL}/${this.AUTH_URI}/login`,
      userCredentials
    )
  }

  async getAuthenticatedUser() {
    return await axios.get(`${API_URL}/${this.AUTH_URI}/me`)
  }

  async logout() {
    return await axios.post(`${API_URL}/${this.AUTH_URI}/logout`)
  }

  //! USER PASSWORD

  async passwordResetRequest(email) {
    return await axios.post(`${API_URL}/${this.AUTH_URI}/password/request`, {
      email,
    })
  }

  async passwordResetConfirm(credentials) {
    return await axios.patch(
      `${API_URL}/${this.AUTH_URI}/password/confirm`,
      credentials
    )
  }
}

export default new AuthApi()
