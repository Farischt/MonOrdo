import { useState } from "react"

import Layout from "@/components/layout"
import AuthApi from "@/client/Auth"

export default function RegisterPage({}) {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
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
      await AuthApi.register(user)
      setLoading(false)
    } catch (error) {
      switch (error.response.data.error) {
        case "missing_email":
          setError("Your email adress is missing !")
          break
        case "missing_first_name":
          setError("Your first-name is missing !")
          break
        case "missing_last_name":
          setError("Your last-name is missing !")
          break
        case "missing_password":
          setError("Your password is missing !")
          break
        case "missing_repeat_password":
          setError("Your repeated password is missing !")
          break
        case "missing_phone":
          setError("Your phone number is missing !")
          break
        case "passwords_are_not_the_same":
          setError("Your passwords are not the same !")
          break
        case "password_too_short":
          setError("Your password must be at least 8 characters long !")
          break
        case "password_lowercase_weakness":
          setError(
            "Your password must contain at least one lowercase character !"
          )
          break
        case "password_uppercase_weakness":
          setError(
            "Your password must contain at least one uppercase character !"
          )
          break
        case "password_number_weakness":
          setError("Your password must contain at least one digit !")
          break
        case "password_special_weakness":
          setError(
            "Your password must contain at least one special character !"
          )
          break
        case "email_taken":
          setError("Your email is already taken !")
          break
        default:
          setError("An unknow error occured !")
      }
      setLoading(false)
    }
  }

  return (
    <Layout>
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
          type="text"
          name="phone"
          placeholder="Phone number"
          value={user.phone}
          onChange={handleChange}
          minLength="10"
          maxLength="10"
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
