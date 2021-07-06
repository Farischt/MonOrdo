import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import AdminApi from "@/client/Admin"
// import Layout from "@/components/layout"

export default function AdminLoginPage({}) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/admin")
  }, [])

  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    if (error) setError("")
    setAdmin((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AdminApi.login(admin)
      setLoading(false)
      router.push("/admin")
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <h1> Connexion Admin </h1>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={admin.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={admin.password}
        onChange={handleChange}
      />
      {loading && <p> Chargement... </p>}
      {error && <p> {error} </p>}
      <button type="submit"> Envoyer </button>
    </form>
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
