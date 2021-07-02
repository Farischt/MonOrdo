import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import DoctorApi from "@/client/Doctor"
import Layout from "@/components/layout"

export default function doctorLoginPage({}) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/doctor")
  }, [])

  const [doctor, setDoctor] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
      await DoctorApi.login(doctor)
      setLoading(false)
      router.push("/doctor")
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
        {loading && <p> Chargement... </p>}
        {error && <p> {error} </p>}
        <button type="submit"> Envoyer </button>
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
