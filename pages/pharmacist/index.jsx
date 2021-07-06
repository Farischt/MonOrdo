import Layout from "@/components/layout"
import Link from "next/link"

import styles from "@/styles/Profile.module.css"

export default function DoctorIndexPage({ user }) {
  return (
    <Layout user={user} title={`Votre espace pharmacien`}>
      <main className={styles.main}>
        <section className={styles.informations}>
          <p className={styles.headerText}>Mes informations</p>
          <div className={styles.card}>
            <table className={styles.informationsTable}>
              <tr>
                <td>Nom</td>
                <td className={styles.detail}>{user.last_name}</td>
              </tr>
              <tr>
                <td>Prénom</td>
                <td className={styles.detail}>{user.first_name}</td>
              </tr>
              <tr>
                <td>N° de RPPS</td>
                <td className={styles.detail}>{user.rpps}</td>
              </tr>
              <tr>
                <td>Date de naissance</td>
                <td className={styles.detail}>{user.birth_date}</td>
              </tr>
              <tr>
                <td>N° de téléphone</td>
                <Link href={`tel:${user.phone_number}`} passHref>
                  <td className={styles.detail}>{user.phone_number}</td>
                </Link>
              </tr>
              <tr>
                <td>Email</td>
                <td className={styles.detail}>{user.email}</td>
              </tr>
            </table>
          </div>
        </section>
      </main>
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
