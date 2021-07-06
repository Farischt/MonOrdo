import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import Spinner from "@/components/Spinner"
import AuthApi from "@/client/Auth"
import styles from "@/styles/Login.module.css"

import logo from "@/public/logo.svg"
import iphone from "@/public/iphone.png"

export default function LoginPage({ user }) {
  const router = useRouter()

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  })
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (window && window.localStorage.getItem("remember")) {
      setUserCredentials((previousState) => ({
        ...previousState,
        email: window.localStorage.getItem("remember"),
      }))
    }
  }, [])

  const handleChange = (event) => {
    if (error) setError("")

    setUserCredentials((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleRememberChange = () => {
    setRemember((previousState) => !previousState)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await AuthApi.login(userCredentials)
      if (window && remember) {
        if (window.localStorage.getItem("remember")) {
          window.localStorage.removeItem("remember")
        }
        window.localStorage.setItem("remember", userCredentials.email)
      }
      setLoading(false)
      router.push("/user")
    } catch (error) {
      setLoading(false)
      switch (error.response.data.error) {
        case "missing_email":
          setError("Veuillez remplir le champ email !")
          break
        case "missing_password":
          setError("Veuillez remplir le champ mot de passe !")
          break
        case "invalid_credentials":
          setError("Identifiants incorrects !")
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
            <h2>Bienvenu sur MonOrdo {user && user.first_name} !</h2>
            {!user && <p>Vos ordonnances sécurisées en ligne</p>}
          </div>
          {user && user.rpps && user.pharmacist && (
            <p style={{ textAlign: "center" }}>
              Votre espace pharmacien{" "}
              <Link href="/pharmacist">
                <a> ici </a>
              </Link>
            </p>
          )}
          {user && user.rpps && !user.pharmacist && (
            <p style={{ textAlign: "center" }}>
              Votre espace médecin{" "}
              <Link href="/doctor">
                <a> ici </a>
              </Link>
            </p>
          )}
          {user && !user.rpps && !user.admin && (
            <p style={{ textAlign: "center" }}>
              Votre espace patient{" "}
              <Link href="/user">
                <a> ici </a>
              </Link>
            </p>
          )}
          {user && user.admin && (
            <p style={{ textAlign: "center" }}>
              Votre espace admin{" "}
              <Link href="/admin">
                <a> ici </a>
              </Link>
            </p>
          )}
          {!user && (
            <form className={styles.form} method="POST" onSubmit={handleSubmit}>
              <div className={styles.input}>
                <p className={styles.label}>Email</p>
                <input
                  type="email"
                  name="email"
                  placeholder="..."
                  value={userCredentials.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <p className={styles.label}>Mot de passe</p>
                <input
                  type="password"
                  name="password"
                  placeholder="..."
                  value={userCredentials.password}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.loginBlock}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={remember}
                    onChange={handleRememberChange}
                    style={{ marginRight: "5px" }}
                  />
                  <label htmlFor="rememberMe"> Se souvenir de moi </label>
                </div>
                {error && <p className={styles.error}> {error} </p>}
                {loading && <Spinner />}
                <button className={styles.loginBtn}>Se connecter</button>
                <Link href="/auth/password">
                  <a>Mot de passe oublié ?</a>
                </Link>
                <p className="text-center no-account">
                  Vous n'avez pas de compte ?{" "}
                  <Link href="/auth/register">
                    <a>Inscrivez-vous !</a>
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
      <section className={styles.sides}>
        {!user && (
          <Link href="/auth/doctor">
            <button className={styles.redirectMedic}>
              Vous êtes médecin ?
            </button>
          </Link>
        )}
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
  const user = await Backend.getAuthenticatedUser(context)

  if (!user) {
    return {
      props: {
        user: null,
      },
    }
  }

  return {
    props: {
      user: {
        rpps: user.rpps || null,
        admin: user.admin || null,
        pharmacist: user.pharmacist || null,
        first_name: user.first_name,
      },
    },
  }
}
