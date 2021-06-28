import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import Layout from "@/components/layout"
import AuthApi from "@/client/Auth"

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
      router.prefetch("/auth")
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
      router.push("/auth")
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
    <Layout user={null}>
      <form method="PATCH" onSubmit={handleSubmit}>
        <input value={token.email} readOnly />
        <input
          type="password"
          name="newPassword"
          placeholder="Nouveau mot de passe..."
          onChange={handleChange}
          value={data.newPassword}
          required
        />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeter votre nouveau mot de passe..."
          onChange={handleChange}
          value={data.repeatPassword}
          required
        />
        {loading && <p> Chargement... </p>}
        {error && <p> {error} </p>}
        <button type="submit"> Envoyer </button>
      </form>
    </Layout>
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
