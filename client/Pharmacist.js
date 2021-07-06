import axios from "axios"
import { API_URL } from "./config.json"

class PharmacistApi {
  async usePrescription(prescriptionId) {
    return (
      prescriptionId &&
      (await axios.patch(
        `${API_URL}/pharmacist/prescription/${prescriptionId}`
      ))
    )
  }
}

export default new PharmacistApi()
