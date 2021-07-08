import axios from "axios"
import { API_URL } from "./config.json"

class DoctorApi {
  constructor() {
    this.AUTH_URI = "auth"
    this.DOCTOR_URI = "doctor"
  }

  //! AUTHENTICATION

  async login(credentials) {
    return await axios.post(
      `${API_URL}/${this.AUTH_URI}/${this.DOCTOR_URI}/login`,
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
    data.append("pharmacist", doctor.pharmacist)
    return await axios.post(
      `${API_URL}/${this.AUTH_URI}/${this.DOCTOR_URI}/register`,
      data
    )
  }

  //! PASSWORD

  //! CREATE PRESCRIPTION
  async createPrescription(data) {
    const parsedData = {
      ...data,
      content: [data.content],
    }

    return (
      data &&
      parsedData &&
      (await axios.post(
        `${API_URL}/${this.DOCTOR_URI}/prescription`,
        parsedData
      ))
    )
  }
}

export default new DoctorApi()
