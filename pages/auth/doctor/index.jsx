import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import DoctorApi from "@/client/Doctor"
import Spinner from "@/components/Spinner"
import styles from "@/styles/Login.module.css"

import logo from "@/public/logo.svg"
import proSanteConnect from "@/public/proSanteConnect.svg"

export default function doctorLoginPage({}) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/doctor")
    router.prefetch("/pharmacist")
    if (window && window.localStorage.getItem("rememberDoctor")) {
      setDoctor((previousState) => ({
        ...previousState,
        email: window.localStorage.getItem("rememberDoctor"),
      }))
    }
  }, [])

  const [doctor, setDoctor] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [remember, setRemember] = useState(false)

  const handleRememberChange = () => {
    setRemember((previousState) => !previousState)
  }

  const handleChange = (event) => {
    if (error) setError("")
    setDoctor((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await DoctorApi.login(doctor)
      if (window && remember) {
        if (window.localStorage.getItem("rememberDoctor")) {
          window.localStorage.removeItem("rememberDoctor")
        }
        window.localStorage.setItem("rememberDoctor", doctor.email)
      }
      setLoading(false)
      if (response.data.pharmacist) {
        router.push("/pharmacist")
      } else {
        router.push("/doctor")
      }
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.sides}>
        <div className={styles.authBlock}>
          <div className={styles.headerSection}>
            <Image src={logo} alt="Logo" width="100px" height="100px" />
            <h2>Bienvenu sur MonOrdo !</h2>
            <p>Vos ordonnances sécurisées en ligne</p>
          </div>
          <form className={styles.form} method="POST" onSubmit={handleSubmit}>
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
              <p className={styles.label}>Mot de passe</p>
              <input
                type="password"
                name="password"
                placeholder="..."
                value={doctor.password}
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
                  id="remember"
                  checked={remember}
                  onChange={handleRememberChange}
                  style={{ marginRight: "5px" }}
                />
                <label htmlFor="remember"> Se souvenir de moi </label>
              </div>
              {error && <p className={styles.error}> {error} </p>}
              {loading && <Spinner />}
              <button className={styles.loginBtn}>Se connecter</button>
              <Link href="/auth/password">
                <a>Mot de passe oublié ?</a>
              </Link>
              <p>ou se connecter avec</p>
              <div className={styles.proSanteConnect}>
                <img src={proSanteConnect} alt="" />
              </div>
              <p className="text-center no-account">
                Vous n'avez pas de compte ?{" "}
                <Link href="/auth/doctor/register">
                  <a>Inscrivez-vous !</a>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
      <section className={styles.sides}>
        <Link href="/">
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
