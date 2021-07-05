import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import AuthApi from "@/client/Auth"
import Spinner from "@/components/Spinner"

import logo from "@/public/logo.svg"
import styles from "@/styles/Login.module.css"

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (event) => {
    if (error) setError("")
    if (success) setSuccess("")

    setEmail(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.passwordResetRequest(email)
      setLoading(false)
      setSuccess("Un e-mail vous a été envoyé !")
    } catch (error) {
      setLoading(false)
      switch (error.response.data.error) {
        case "missing_email":
          setError("Veuillez saisir votre e-mail !")
          break
        case "invalid_email":
          setError("E-mail invalide !")
          break
        case "already_sent":
          setError("Un e-mail vous a déjà été envoyé !")
          break
        default:
          setError(
            "Erreur inconnue ! Si le problème persiste, veuillez contacter notre support."
          )
      }
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.sides}>
        <div className={styles.authBlock}>
          <div className={styles.headerSection}>
            <Image src={logo} alt="Logo" width="100px" height="100px" />
            <h2> Réinitialisation du mot de passe </h2>
          </div>
          <form className={styles.form} method="POST" onSubmit={handleSubmit}>
            <div className={styles.input}>
              <p className={styles.label}>Email</p>
              <input
                type="email"
                name="email"
                placeholder="..."
                value={email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.loginBlock}>
              {error && <p className={styles.error}> {error} </p>}
              {success && <p> {success} </p>}
              {loading && <Spinner />}
              <button className={styles.loginBtn}> Envoyer </button>
            </div>
          </form>
        </div>
      </section>
      <section className={styles.sides}>
        <Link href="/">
          <button className={styles.redirectMedic}> Se connecter ? </button>
        </Link>
        <div>
          <h1 className={styles.title}>MonOrdo</h1>
          <p className={styles.description}>
            L'ordonnance en ligne sécurisée et rapide.
          </p>
        </div>
      </section>
    </div>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      success: true,
    },
  }
}
