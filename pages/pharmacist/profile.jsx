import Link from "next/link"

import Layout from "@/components/layout"
import AssetApi from "@/client/Asset"
import styles from "@/styles/Profile.module.css"

export default function PharmacistProfilePage({ user }) {
  return (
    <Layout user={user} title={`Votre espace pharmacien`}>
      <main className={styles.main}>
        <section className={styles.informations}>
          <p className={styles.headerText}>Mes informations</p>
          <div className={styles.card}>
            <table className={styles.informationsTable}>
              <tbody>
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
                <tr>
                  <td>Pièce d'identité</td>
                  <td className={styles.detail}>
                    <a
                      href={AssetApi.getEncoded(user.identity_card)}
                      target="blank"
                    >
                      Cliquez ici
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Carte de médecin</td>
                  <td className={styles.detail}>
                    <a
                      href={AssetApi.getEncoded(user.doctor_card)}
                      target="blank"
                    >
                      Cliquez ici
                    </a>
                  </td>
                </tr>
              </tbody>
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
