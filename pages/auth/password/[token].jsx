import Layout from "@/components/layout"
import AuthApi from "@/client/Auth"

import { useEffect, useState } from "react"

export default function PasswordResetConfirmationPage({ token }) {
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
    } catch (error) {
      switch (error.response.data.error) {
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
        />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeter votre nouveau mot de passe..."
          onChange={handleChange}
          value={data.repeatPassword}
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
