import { useState } from "react"
import { useRouter } from "next/router"

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
    setLoading(true)

    try {
      await AuthApi.login(userCredentials)
      setLoading(false)
      router.push("/")
    } catch (error) {
      setLoading(false)
      setError("Une erreur est survenu")
    }
  }

  return (
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
    </form>
  )
}
