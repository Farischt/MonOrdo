import { useState } from "react"

import Layout from "@/components/layout"

export default function AdminLoginPage({}) {
  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  return (
    <Layout user={null}>
      <form method="POST">
        <h1> Connexion Admin </h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={admin.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={admin.password}
        />
        {loading && <p> Chargement... </p>}
        {error && <p> {error} </p>}
        <button type="submit"> Envoyer </button>
      </form>
    </Layout>
  )
}
