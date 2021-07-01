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

  // ! Doctor Registration

  async sendDoctorRegistrationConfirmation(to, first_name) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: "Votre inscription en tant que médecin !",
        text: "Votre inscription en tant que médecin !",
        html: `<div> <h1> Merci pour votre inscription ${first_name} </h1>
          <p> Nous avons bien enregistré votre inscription en tant que médecin ! Nous allons désormais procéder à une vérification de votre statut. Une fois cette vérification faite, un mail vous sera envoyé et vous pourrez utiliser toutes les fonctionnalités de MonOrdo grâce aux identifiants que vous avez saisi lors de votre inscription. Cette vérification peut prendre jusqu'à 48h, alors pas de panique !</p>
        </div>`,
      })
    } catch (error) {
      console.log("Doctor registration confirmation email not sent !")
      console.log(error)
    }
  }

  async sendDoctorVerified(to, first_name) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: "Votre compte médecin est validé !",
        text: "Votre compte médecin est validé !",
        html: `<div> <h1> Félicitation, votre compte est validé ! </h1> 
         <p> Bonjour ${first_name} ! Nous vérifié vos informations avec succès ! Vous pouvez désormais profiter des fonctionnalités de MonOrdo sans aucune restriction ! Rendez-vous sur notre site pour plus d'information ! </p>
        </div>`,
      })
    } catch (error) {
      console.log("Doctor registration verified email not sent !")
    }
  }

  async sendAdminDoctorRegistration(to, first_name, last_name, rpps) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: "Un nouveau médecin en attente de vérification !",
        text: "Un nouveau médecin en attente de vérification !",
        html: `<div> <h1> Et un de plus ! </h1> 
          <p> Le médecin ${first_name} ${last_name} titulaire du rpps ${rpps} est en attente de vérification ! Rendez-vous sur votre dashboard administrateur afin de procéder à la vérification ! </p> 
        </div>`,
      })
    } catch (error) {
      console.log("Admin doctor registration email not sent !")
    }
  }
}

export default new EmailService()
