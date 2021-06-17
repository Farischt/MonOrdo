import { useState } from "react"
import { useRouter } from "next/router"

import Layout from "@/components/layout"
import AuthApi from "@/client/Auth"

export default function LoginPage() {
  const router = useRouter()

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    if (error) setError("")

    setUserCredentials((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await AuthApi.login(userCredentials)
      setLoading(false)
      router.push("/")
    } catch (error) {
      setLoading(false)
      switch (error.response.data.error) {
        case "missing_email":
          setError("Your email is missing !")
          break
        case "missing_password":
          setError("Your password is missing !")
          break
        case "invalid_credentials":
          setError("Invalid credentials !")
          break
        default:
          setError("An unknow error occured !")
      }
    }
  }

  return (
    <Layout>
      <form method="POST" onSubmit={handleSubmit}>
        <h1> Login </h1>
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
          placeholder="Password"
          value={userCredentials.password}
          onChange={handleChange}
        />
        <button type="submit"> Submit </button>
        {error && <p> {error} </p>}
        {loading && <p> Loading... </p>}
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
