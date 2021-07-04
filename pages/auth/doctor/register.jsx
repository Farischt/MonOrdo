import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import Layout from "@/components/layout"
import DoctorApi from "@/client/Doctor"

export default function RegisterPage({}) {
  const router = useRouter()

  const [doctor, setDoctor] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    rpps: "",
    password: "",
    repeatPassword: "",
    pharmacist: false,
    identity_card: null,
    doctor_card: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    if (error) setError("")

    if (
      event.target.name === "identity_card" ||
      event.target.name === "doctor_card"
    ) {
      setDoctor((state) => ({
        ...state,
        [event.target.name]: event.target.files.length && event.target.files[0],
      }))
    } else if (event.target.name === "pharmacist") {
      setDoctor((state) => ({ ...state, pharmacist: !state.pharmacist }))
    } else {
      setDoctor((state) => ({
        ...state,
        [event.target.name]: event.target.value,
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await DoctorApi.register(doctor)
      setLoading(false)
      router.push("/")
    } catch (error) {
      switch (error.response.data.error) {
        case "invalid_phone_number":
          setError("Votre numéro de téléphone est invalide !")
          break
        case "invalid_rpps":
          setError("Votre numéro RPPS est invalide !")
          break
        case "invalid_passwords":
          setError("Vos mots de passe ne sont pas identiques !")
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
          setError("Cette adresse mail est déjà utilisé !")
          break
        case "rpps_taken":
          setError("Ce numéro RPPS est déjà utlisé !")
          break
        default:
          setError("An unknow error occured !")
      }
      setLoading(false)
    }
  }

  return (
    <Layout user={null}>
      <form method="POST" onSubmit={handleSubmit}>
        <h1> Sign up </h1>
        <input
          type="text"
          name="first_name"
          placeholder="First name"
          value={doctor.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last name"
          value={doctor.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={doctor.email}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birth_date"
          placeholder="Date de naissance"
          value={doctor.birth_date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone number"
          value={doctor.phone_number}
          onChange={handleChange}
          minLength="10"
          maxLength="10"
          required
        />
        <input
          type="text"
          name="rpps"
          placeholder="Numéro RPPS"
          value={doctor.rpps}
          onChange={handleChange}
          minLength="11"
          maxLength="11"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={doctor.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="repeatPassword"
          placeholder="Password"
          value={doctor.repeatPassword}
          onChange={handleChange}
          required
        />
        <label htmlFor="identity_card"> Carte d'identité </label>
        <input
          type="file"
          id="identity_card"
          name="identity_card"
          onChange={handleChange}
          required
        />
        <label htmlFor="doctor_card"> Carte de médecin </label>
        <input
          type="file"
          id="doctor_card"
          name="doctor_card"
          onChange={handleChange}
          required
        />
        <label htmlFor="pharmacist"> Êtes vous un pharmacien ?</label>
        <input
          type="checkbox"
          id="pharmacist"
          name="pharmacist"
          value={doctor.pharmacist}
          onChange={handleChange}
          required
        />
        {doctor && doctor.doctor_card && (
          <img
            src={URL.createObjectURL(doctor.doctor_card)}
            style={{ height: "10rem", width: "20rem", objectFit: "cover" }}
          />
        )}
        {doctor && doctor.identity_card && (
          <img
            src={URL.createObjectURL(doctor.identity_card)}
            style={{ height: "10rem", width: "20rem", objectFit: "cover" }}
          />
        )}
        <button type="submit"> Send </button>
        {error && <p> {error} </p>}
        {loading && <p> Loading... </p>}
        <Link href="/auth/register">
          <a> Vous êtes patient ? </a>
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
