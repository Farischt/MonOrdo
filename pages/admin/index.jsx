import { useState } from "react"
import { useRouter } from "next/router"

import Layout from "@/components/layout"
import AssetApi from "@/client/Asset"
import AdminApi from "@/client/Admin"

export default function AdminIndexPage({ user, doctors }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleVerifyDoctor = async (id) => {
    setLoading(true)
    try {
      await AdminApi.verifyDoctor(id)
      setLoading(false)
      router.replace(router.asPath, null, { scroll: false })
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  return (
    <Layout user={user}>
      <h1> Page d'accueil admin </h1>
      <ul>
        <h3> Liste des médecins en attente de vérification ! </h3>
        {doctors &&
          doctors.map((doctor) => {
            return (
              <li key={doctor.id}>
                {doctor.first_name} - {doctor.last_name} - {doctor.rpps} (RPPS)
                -{" "}
                <a
                  target="blank"
                  href={AssetApi.getEncoded(doctor.identity_card_id)}
                >
                  Carte d'identité
                </a>{" "}
                -{" "}
                <a
                  target="blank"
                  href={AssetApi.getEncoded(doctor.doctor_card_id)}
                >
                  Carte de médecin
                </a>{" "}
                <button
                  onClick={() => {
                    handleVerifyDoctor(doctor.id)
                  }}
                  disabled={loading}
                >
                  Vérifier le médecin !
                </button>
                {loading && <p> Chargement... </p>}
              </li>
            )
          })}
      </ul>
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)
  if (!user || !user.admin) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    }
  }

  const doctors = await Database.Doctor.findAll({
    where: {
      verified: false,
    },
  })
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }

  return {
    props: {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        admin: user.admin,
      },

      doctors:
        doctors &&
        doctors.map((doctor) => ({
          id: doctor.id,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          birth_date: doctor.birth_date,
          email: doctor.email,
          rpps: doctor.rpps,
          doctor_card_id: doctor.doctor_card,
          identity_card_id: doctor.identity_card,
          created_at: doctor.createdAt.toLocaleDateString("en-GB", dateOptions),
        })),
    },
  }
}
