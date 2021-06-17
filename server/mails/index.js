import nodemailer from "nodemailer"
import { CREDENTIALS, WEBSITE_URL } from "./config.js"

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: CREDENTIALS.APP_EMAIL,
        pass: CREDENTIALS.APP_PASSWORD,
      },
    })
  }

  async sendAccountConfirmationMail(to, name, code) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to: to,
        subject: "Confirm your account !",
        text: "Confirm your account !",
        html: `<div> 
                 <h1> Thanks for your registration ${name} &#129321; ! </h1>
                 <p> In order to complete your registration, please click on this link <a href="${WEBSITE_URL}/auth/${encodeURIComponent(
          code
        )}"> </a> </p>
               </div> `,
      })
    } catch (error) {
      console.log(error)
    }
  }
}
