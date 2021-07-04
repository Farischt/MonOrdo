import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import DoctorApi from "@/client/Doctor"
import Layout from "@/components/layout"

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
    <Layout user={null}>
      <form method="POST" onSubmit={handleSubmit}>
        <h1> Connexion Docteur </h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={doctor.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={doctor.password}
          onChange={handleChange}
        />
        <input
          type="checkbox"
          id="rememberMe"
          checked={remember}
          onChange={handleRememberChange}
        />
        <label htmlFor="rememberMe"> Se souvenir de moi </label>
        <Link href="/auth/password">
          <a> Mot de passe oublié ? </a>
        </Link>
        {loading && <p> Chargement... </p>}
        {error && <p> {error} </p>}
        <button type="submit"> Envoyer </button>
        <Link href="/auth">
          <a> Vous êtes un patient ? </a>
        </Link>
      </form>
    </Layout>
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
