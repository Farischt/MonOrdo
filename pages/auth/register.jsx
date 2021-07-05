import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import AuthApi from "@/client/Auth"
import Spinner from "@/components/Spinner"
import styles from "@/styles/Register.module.css"

import logo from "@/public/logo.svg"
import iphone from "@/public/iphone.png"

export default function RegisterPage({}) {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birth_date: "",
    social_security: "",
    password: "",
    repeatPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (event) => {
    if (error) setError("")
    if (success) setSuccess("")

    setUser((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.register(user)
      setLoading(false)
      setSuccess("Votre inscription a bien été enregistré !")
    } catch (error) {
      switch (error.response.data.error) {
        case "invalid_social_security":
          setError(
            "Le numéro de sécurité sociale doit être composé de 13 chiffres !"
          )
          break
        case "passwords_are_not_the_same":
          setError("Vos mots de passe ne sont pas identiques !")
          break
        case "password_too_short":
          setError("Votre mot de passe doit contenir au moins 8 caractères !")
          break
        case "password_lowercase_weakness":
          setError(
            "Votre mot de passe doit contenir au moins un caractère minuscule !"
          )
          break
        case "password_uppercase_weakness":
          setError(
            "Votre mot de passe doit contenir au moins un caractère majuscule !"
          )
          break
        case "password_number_weakness":
          setError("Votre mot de passe doit contenir au moins un chiffre !")
          break
        case "password_special_weakness":
          setError(
            "Votre mot de passe doit contenir au moins un caractère spécial !"
          )
          break
        case "email_taken":
          setError("Cet e-mail est déjà utilisé !")
          break
        default:
          setError("Erreur inconnue !")
      }
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.sides}>
        <div className={styles.authBlock}>
          <div className={styles.headerSection}>
            <Image src={logo} alt="Logo" width="100px" height="100px" />
            <h2> Inscription MonOrdo patient </h2>
            {/* <p> Inscrivez-vous </p> */}
          </div>
          <form className={styles.form} method="POST" onSubmit={handleSubmit}>
            <div className={styles.input}>
              <p className={styles.label}>Prénom</p>
              <input
                type="text"
                name="first_name"
                placeholder="..."
                value={user.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Nom</p>
              <input
                type="text"
                name="last_name"
                placeholder="..."
                value={user.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>E-mail</p>
              <input
                type="email"
                name="email"
                placeholder="..."
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Date de naissance</p>
              <input
                type="date"
                name="birth_date"
                value={user.birth_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Numéro de téléphone</p>
              <input
                type="text"
                name="phone"
                placeholder="..."
                value={user.phone}
                onChange={handleChange}
                minLength="10"
                maxLength="10"
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Numéro de sécurité sociale</p>
              <input
                type="text"
                name="social_security"
                placeholder="..."
                value={user.social_security}
                onChange={handleChange}
                minLength="13"
                maxLength="13"
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Mot de passe</p>
              <input
                type="password"
                name="password"
                placeholder="..."
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Mot de passe</p>
              <input
                type="password"
                name="repeatPassword"
                placeholder="..."
                value={user.repeatPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.loginBlock}>
              {error && <p className={styles.error}> {error} </p>}
              {success && <p> {success} </p>}
              {loading && <Spinner />}
              <button className={styles.loginBtn}>S'inscrire</button>

              <p className="text-center no-account">
                Vous avez un compte ?{" "}
                <Link href="/">
                  <a>Connectez-vous !</a>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
      <section className={styles.sides}>
        <Link href="/auth/doctor/register">
          <button className={styles.redirectMedic}>Vous êtes médecin ?</button>
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
