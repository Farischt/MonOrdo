import { useState } from "react"

import Layout from "@/components/layout/index"

export default function PharmacistIndexPage({ user }) {
  const [data, setData] = useState("Scannez votre QR Code")

  const handleScan = (data) => {
    setData(data)
  }

  const handleError = (error) => {
    console.log(error)
  }

  return (
    <Layout user={user} title={`Bienvenu ${user.first_name}`}>
      <p> {data && data} </p>
    </Layout>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  if (!user || !user.pharmacist) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: user && {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        verified: user.verified,
        rpps: user.rpps,
        pharmacist: user.pharmacist,
        doctor_card: user.doctor_card,
        identity_card: user.identity_card,
      },
    },
  }
}
