import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import DoctorApi from "@/client/Doctor"
import Spinner from "@/components/Spinner"
import styles from "@/styles/Register.module.css"

import logo from "@/public/logo.svg"

export default function RegisterPage({}) {
  const [doctor, setDoctor] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    rpps: "",
    password: "",
    repeatPassword: "",
    pharmacist: false,
    identity_card: null,
    doctor_card: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (event) => {
    if (error) setError("")
    if (success) setSuccess("")

    if (
      event.target.name === "identity_card" ||
      event.target.name === "doctor_card"
    ) {
      setDoctor((state) => ({
        ...state,
        [event.target.name]: event.target.files.length && event.target.files[0],
      }))
    } else if (event.target.name === "pharmacist") {
      setDoctor((state) => ({ ...state, pharmacist: !state.pharmacist }))
    } else {
      setDoctor((state) => ({
        ...state,
        [event.target.name]: event.target.value,
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await DoctorApi.register(doctor)
      setLoading(false)
      setSuccess("Votre inscription a bien été enregistré !")
    } catch (error) {
      switch (error.response.data.error) {
        case "invalid_phone_number":
          setError("Votre numéro de téléphone est invalide !")
          break
        case "invalid_rpps":
          setError("Votre numéro RPPS est invalide !")
          break
        case "invalid_passwords":
          setError("Vos mots de passe ne sont pas identiques !")
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
        case "rpps_taken":
          setError("Ce numéro RPPS est déjà utlisé !")
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
            <h2>Inscription MonOrdo Docteur</h2>
          </div>
          <form className={styles.form} method="POST" onSubmit={handleSubmit}>
            <div className={styles.input}>
              <p className={styles.label}>Prénom</p>
              <input
                type="text"
                name="first_name"
                placeholder="..."
                value={doctor.first_name}
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
                value={doctor.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Email</p>
              <input
                type="email"
                name="email"
                placeholder="..."
                value={doctor.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Date de naissance</p>
              <input
                type="date"
                name="birth_date"
                placeholder="..."
                value={doctor.birth_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Téléphone</p>
              <input
                type="tel"
                name="phone_number"
                placeholder="..."
                value={doctor.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>RPPS</p>
              <input
                type="text"
                name="rpps"
                placeholder="..."
                value={doctor.rpps}
                onChange={handleChange}
                minLength="11"
                maxLength="11"
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Mot de passe</p>
              <input
                type="password"
                name="password"
                placeholder="..."
                value={doctor.password}
                onChange={handleChange}
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Répéter mot de passe</p>
              <input
                type="password"
                name="repeatPassword"
                placeholder="..."
                value={doctor.repeatPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Carte d'indentité</p>
              <input
                type="file"
                id="identity_card"
                name="identity_card"
                placeholder="..."
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.input}>
              <p className={styles.label}>Carte de médecin</p>
              <input
                type="file"
                id="doctor_card"
                name="doctor_card"
                placeholder="..."
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="pharmacist"> Êtes vous un pharmacien ?</label>
              <input
                type="checkbox"
                id="pharmacist"
                name="pharmacist"
                value={doctor.pharmacist}
                onChange={handleChange}
              />
            </div>
            <div className={styles.loginBlock}>
              {error && <p className={styles.error}> {error} </p>}
              {success && <p> {success} </p>}
              {loading && <Spinner />}
              <button className={styles.loginBtn} type="submit">
                S'inscrire
              </button>
            </div>

            <Link href="/auth/doctor">
              <a style={{ marginTop: "15px" }}> Vous avez déjà un compte ? </a>
            </Link>
          </form>
        </div>
      </section>
      <section className={styles.sides}>
        <Link href="/auth/register">
          <button className={styles.redirectMedic}>Vous êtes patient ?</button>
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
