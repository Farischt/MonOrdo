import { useState } from "react"
import { AuthApi } from "@/client/Auth"

export default function Home({}) {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeatPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    if (error) setError("")

    setUser((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthApi(user)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError("Error occured")
    }
  }

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <h1> Sign up </h1>
      <input
        type="text"
        name="first_name"
        placeholder="First name"
        value={user.first_name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last name"
        value={user.last_name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="repeatPassword"
        placeholder="Password"
        value={user.repeatPassword}
        onChange={handleChange}
      />
      <button type="submit"> Send </button>
    </form>
  )
}

import Database from "@/server/database"

export const getServerSideProps = (context) => {
  const user = Database.User.findOne({
    where: {
      email: "test",
    },
  })

  return {
    props: {
      success: true,
    },
  }
}
