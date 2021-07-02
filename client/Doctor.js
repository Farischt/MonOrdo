import axios from "axios"
import { API_URL } from "./config.json"

class DoctorApi {
  constructor() {
    this.AUTH_END_POINT = "auth"
    this.DOCTOR_END_POINT = "doctor"
  }

  //! AUTHENTICATION

  async login(credentials) {
    return await axios.post(
      `${API_URL}/${this.AUTH_END_POINT}/${this.DOCTOR_END_POINT}/login`,
      credentials
    )
  }

  async register(doctor) {
    let data = new FormData()
    if (doctor.first_name) data.append("first_name", doctor.first_name)
    if (doctor.last_name) data.append("last_name", doctor.last_name)
    if (doctor.email) data.append("email", doctor.email)
    if (doctor.phone_number) data.append("phone_number", doctor.phone_number)
    if (doctor.birth_date) data.append("birth_date", doctor.birth_date)
    if (doctor.rpps) data.append("rpps", doctor.rpps)
    if (doctor.password) data.append("password", doctor.password)
    if (doctor.repeatPassword)
      data.append("repeatPassword", doctor.repeatPassword)
    if (doctor.identity_card) data.append("identity_card", doctor.identity_card)
    if (doctor.doctor_card) data.append("doctor_card", doctor.doctor_card)
    return await axios.post(
      `${API_URL}/${this.AUTH_END_POINT}/${this.DOCTOR_END_POINT}/register`,
      data
    )
  }

  //! PASSWORD

  //! CREATE ADMIN
}

export default new DoctorApi()
