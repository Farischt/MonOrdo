import Layout from "@/components/layout"

export default function DoctorIndexPage({ user, prescriptions }) {
  return (
    <Layout user={user}>
      <h1> Bienvenue sur votre espace médecin {user.first_name} </h1>
      <h3> Vos ordonnances : </h3>
      {prescriptions && prescriptions.length && JSON.stringify(prescriptions)}
    </Layout>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  if (!user || !user.rpps || user.pharmacist) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    }
  }

  const prescriptions = await Promise.all(
    (
      await user.getDoctorPrescriptions()
    ).map(async (prescription) => {
      return {
        patient: await prescription.getPatient(),
        expiration_date: prescription.expiration_date,
        reusable: prescription.reusable,
        max_use: prescription.max_use,
        content: prescription.content,
      }
    })
  )

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

      prescriptions:
        prescriptions &&
        prescriptions.map((prescription) => ({
          patient: {
            id: prescription.patient.id,
            first_name: prescription.patient.first_name,
            last_name: prescription.patient.last_name,
            email: prescription.patient.email,
            social_security: prescription.patient.social_security,
            phone_number: prescription.patient.phone_number,
            birth_date: prescription.patient.birth_date,
          },
          expiration_date: prescription.expiration_date,
          reusable: prescription.reusable,
          max_use: prescription.max_use,
          content: prescription.content,
        })),
    },
  }
}
