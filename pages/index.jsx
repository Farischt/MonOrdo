// import Layout from "@/components/layout"

// export default function HomePage({ user }) {
//   return (
//     <Layout user={user}>
//       <h1> Page d'accueil </h1>
//     </Layout>
//   )
// }

// import Backend from "@/server/index"

// export const getServerSideProps = async (context) => {
//   const user = await Backend.getAuthenticatedUser(context)

//   return {
//     props: {
//       user: user && {
//         id: user.id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         phone_number: user.phone_number,
//         social_security: user.social_security || null,
//         birth_date: user.birth_date,
//         admin: user.admin || null,
//         verified: user.verified,
//         rpps: user.rpps || null,
//         pharmacist: user.pharmacist || null,
//       },
//     },
//   }
// }

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import Layout from "@/components/layout"
import AuthApi from "@/client/Auth"

export default function LoginPage() {
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
      router.push("/")
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
    <Layout user={null}>
      <form method="POST" onSubmit={handleSubmit}>
        <h1> Connexion </h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userCredentials.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={userCredentials.password}
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
        <button type="submit"> Se connecter </button>
        {error && <p> {error} </p>}
        {loading && <p> Chargement... </p>}
        <Link href="/auth/doctor">
          <a> Vous êtes médecin ? </a>
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
