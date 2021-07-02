import axios from "axios"
import { API_URL } from "./config.json"

class AdminApi {
  constructor() {
    this.AUTH_URI = "auth"
    this.ADMIN_URI = "admin"
    this.DOCTOR_URI = "doctor"
  }

  //! AUTHENTICATION

  async login(credentials) {
    return (
      credentials &&
      (await axios.post(
        `${API_URL}/${this.AUTH_URI}/${this.ADMIN_URI}/login`,
        credentials
      ))
    )
  }

  //! DOCTORS VERIFICATION
  async verifyDoctor(doctorId) {
    return (
      doctorId &&
      (await axios.patch(
        `${API_URL}/${this.ADMIN_URI}/${this.DOCTOR_URI}/${doctorId}`
      ))
    )
  }

  async getUnverifiedDoctors(page) {
    return page
      ? await axios.get(
          `${API_URL}/${this.ADMIN_URI}/${this.DOCTOR_URI}?page=${page}`
        )
      : await axios.get(`${API_URL}/${this.ADMIN_URI}/${this.DOCTOR_URI}`)
  }

  //! PASSWORD

  //! CREATE ADMIN
}

export default new AdminApi()
