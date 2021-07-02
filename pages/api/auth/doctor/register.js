import Backend from "@/server/index"
import Database from "@/server/database"
import EmailService from "@/server/mails/index"
import { promises as fs } from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  if (req.method === "POST") {
    await Backend.parseMultipart({ req, res })

    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    } else if (typeof req.body.first_name !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_first_name" })
    } else if (typeof req.body.last_name !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_last_name" })
    } else if (typeof req.body.password !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    } else if (typeof req.body.repeatPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_repeat_password" })
    } else if (req.body.password !== req.body.repeatPassword) {
      res.statusCode = 400
      return res.json({ error: "invalid_passwords" })
    } else if (typeof req.body.phone_number !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_phone_number" })
    } else if (req.body.phone_number.length !== 10) {
      res.statusCode = 400
      return res.json({ error: "invalid_phone_number" })
    } else if (typeof req.body.birth_date !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_birth_date" })
    } else if (typeof req.body.rpps !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_rpps" })
    } else if (req.body.rpps.length !== 11) {
      res.statusCode = 400
      return res.json({ error: "invalid_rpps" })
    } else if (!req.files.identity_card) {
      res.statusCode = 400
      return res.json({ error: "missing_identity_card" })
    } else if (!req.files.doctor_card) {
      res.statusCode = 400
      return res.json({ error: "missing_doctor_card" })
    }

    //? Password strength

    if (req.body.password.length < 8) {
      res.statusCode = 400
      return res.json({ error: "password_too_short" })
    } else if (!req.body.password.match(/[a-z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_lowercase_weakness" })
    } else if (!req.body.password.match(/[A-Z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_uppercase_weakness" })
    } else if (!req.body.password.match(/[0-9]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_number_weakness" })
    } else if (!req.body.password.match(/[^0-9a-zA-Z\s]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_special_weakness" })
    }

    const {
      email,
      first_name,
      last_name,
      password,
      birth_date,
      phone_number,
      rpps,
    } = req.body

    if (await Database.Doctor.emailTaken(email)) {
      res.statusCode = 400
      return res.json({ error: "email_taken" })
    } else if (await Database.Doctor.rppsTaken(rpps)) {
      res.statusCode = 400
      return res.json({ error: "rpps_taken" })
    }

    const doctor = await Database.Doctor.build({
      email,
      first_name,
      last_name,
      birth_date,
      phone_number,
      rpps,
    })

    await doctor.setPassword(password)

    const identity_card = await Database.Asset.create({
      file_name: req.files.identity_card.name,
      mime_type: req.files.identity_card.type,
      content: await fs.readFile(req.files.identity_card.path),
      private: true,
    })

    const doctor_card = await Database.Asset.create({
      file_name: req.files.doctor_card.name,
      mime_type: req.files.doctor_card.type,
      content: await fs.readFile(req.files.doctor_card.path),
      private: true,
    })

    doctor.identity_card = identity_card.id
    doctor.doctor_card = doctor_card.id
    await doctor.save()

    await EmailService.sendDoctorRegistrationConfirmation(
      doctor.email,
      doctor.first_name
    )
    await EmailService.sendAdminDoctorRegistration(
      doctor.first_name,
      doctor.last_name,
      doctor.rpps
    )

    res.statusCode = 200
    res.json({ succes: true })
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
