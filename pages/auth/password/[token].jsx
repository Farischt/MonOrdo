import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import AuthApi from "@/client/Auth"
import Spinner from "@/components/Spinner"
import styles from "@/styles/Login.module.css"
import logo from "@/public/logo.svg"

export default function PasswordResetConfirmationPage({ token }) {
  const router = useRouter()
  const [data, setData] = useState({
    resetToken: "",
    newPassword: "",
    repeatPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (token.id) {
      setData((state) => ({ ...state, resetToken: token.id }))
      router.prefetch("/")
    }
  }, [])

  const handleChange = (event) => {
    if (error) setError("")
    setData((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.passwordResetConfirm(data)
      setLoading(false)
      router.push("/")
    } catch (error) {
      switch (error.response.data.error) {
        case "passwords_are_not_the_same":
          setError("Les mots de passes ne sont pas identiques !")
          break
        case "password_too_short":
          setError("Votre mot de passe doit contenir au moins 6 caractères !")
          break
        case "password_lowercase_weakness":
          setError("Votre mot de passe doit contenir au moins une minuscule !")
          break
        case "password_uppercase_weakness":
          setError("Votre mot de passe doit contenir au moins une majuscule !")
          break
        case "password_number_weakness":
          setError("Votre mot de passe doit contenir au moins un chiffre")
          break
        case "password_special_weakness":
          setError(
            "Votre mot de passe doit contenir au moins un caractère spécial !"
          )
          break
        case "expired_token":
          setError(
            "Session expirée, veuillez faire une nouvelle demande de mot de passe !"
          )
          break
        default:
          setError("Une erreur inconnue est survenu !")
      }
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.leftSide}>
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
      <section className={styles.rightSide}>
        <div className={styles.authBlock}>
          <div className={styles.headerSection}>
            <Image src={logo} alt="Logo" width="100px" height="100px" />
            <h2> Votre nouveau mot de passe </h2>
          </div>
          <form className={styles.form} method="PATCH" onSubmit={handleSubmit}>
            <div className={styles.input}>
              <p className={styles.label}>E-mail</p>
              <input value={token.email} readOnly />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Nouveau mot de passe</p>
              <input
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe..."
                value={data.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Nouveau mot de passe</p>
              <input
                type="password"
                name="repeatPassword"
                placeholder="Repeter votre nouveau mot de passe..."
                value={data.repeatPassword}
                onChange={handleChange}
              />
            </div>

            <div className={styles.loginBlock}>
              {error && <p className={styles.error}> {error} </p>}
              {/* {success && <p> {success} </p>} */}
              {loading && <Spinner />}
              <button className={styles.loginBtn}> Envoyer </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const token = await Database.PasswordResetToken.findByPk(context.params.token)
  if (!token || token.createdAt < Date.now() - 60 * 60 * 1000) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const user = await token.getUser()

  return {
    props: {
      token: {
        id: token.token,
        email: user.email,
      },
    },
  }
}
