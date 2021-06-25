import { useState } from "react"
import { useRouter } from "next/router"

import AuthApi from "@/client/Auth"
import Layout from "@/components/layout/index"

export default function PasswordResetRequest({ user }) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailChange = (event) => {
    if (error) setError("")

    setEmail(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi.passwordResetRequest(email)
      setLoading(false)
      router.push("/auth")
    } catch (error) {
      setLoading(false)
      switch (error.response.data.error) {
        case "missing_email":
          setError("Veuillez saisir votre mail !")
          break
        case "invalid_email":
          setError("Email invalide !")
          break
        case "already_sent":
          setError("Un email vous a déjà été envoyé !")
          break
        default:
          setError(
            "Erreur inconnue ! Si le problème persiste, veuillez contacter notre support."
          )
      }
    }
  }

  return (
    <Layout user={user}>
      <form method="POST" onSubmit={handleSubmit}>
        <h1> Réinitialisation de votre mot de passe </h1>
        <input
          type="email"
          name="email"
          onChange={handleEmailChange}
          value={email}
          placeholder="Votre mail"
        />
        {loading && <p> Chargement... </p>}
        {error && <p> {error} </p>}
        <button type="submit"> Envoyez </button>
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
      user: null,
    },
  }
}
