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
    this.dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    }
  }

  async sendAccountConfirmationMail(to, name, code) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to: to,
        subject: "Confirmez votre adresse mail !",
        text: "Confirmez votre adresse mail !",
        html: `<div> 
                 <h1> Merci pour votre inscription ${name} &#129321; ! </h1>
                 <p> Afin de finaliser votre inscription, merci de cliquer sur ce <a href="${WEBSITE_URL}/auth/${encodeURIComponent(
          code
        )}"> lien </a> </p>
               </div> `,
      })
    } catch (error) {
      console.log("Account confirmation email not sent !")
    }
  }

  //! PASSWORD

  async sendPasswordResetRequest(to, token) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: "Demande de réinitialisation de votre mot de passe !",
        text: "Demande de réinitialisation de votre mot de passe !",
        html: `<div> 
                  <h1> Une demande de réinitialisation de votre mot de passe a été faite. </h1> 
                  <p> Afin de créer un nouveau mot de passe, merci de cliquer sur ce <a href="${WEBSITE_URL}/auth/password/${encodeURIComponent(
          token
        )}"> lien </a></p>
               </div>
        `,
      })
    } catch (error) {
      console.log("Password reset request email not sent !")
    }
  }

  async sendPasswordResetConfirmation(to, first_name, date) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: "Alerte de sécurité !",
        text: "Alerte de sécurité !",
        html: `<div> <h1> Votre mot de passe a été modifié ! </h1> <p> Bonjour ${first_name}, votre mot de passe a été modifié le : ${date.toUTCString()} ! </p>  </div>`,
      })
    } catch (error) {
      console.log("Password reset confirmation email not sent ! ")
    }
  }
}

export default new EmailService()
