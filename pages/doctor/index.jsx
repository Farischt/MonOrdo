import Link from "next/link"

import AssetApi from "@/client/Asset"

import Layout from "@/components/layout"
import styles from "@/styles/Profile.module.css"

export default function DoctorIndexPage({ user, prescriptions }) {
  return (
    <Layout
      user={user}
      title={`Bienvenue sur votre espace médecin ${user.first_name}`}
    >
      {prescriptions && prescriptions.length && JSON.stringify(prescriptions)}

      <div className={styles.page}>
        <main className={styles.main}>
          {/* <ProfileCard name={"Ornella"} /> */}
          <section className={styles.informations}>
            <p className={styles.headerText}>Mes informations</p>
            <div className={styles.card}>
              <table className={styles.informationsTable}>
                <tr>
                  <td>Prénom</td>
                  <td className={styles.detail}>{user.first_name}</td>
                </tr>
                <tr>
                  <td>Nom</td>
                  <td className={styles.detail}>{user.last_name}</td>
                </tr>
                <tr>
                  <td>N° RPPS</td>
                  <td className={styles.detail}>{user.rpps}</td>
                </tr>
                <tr>
                  <td>N° de téléphone</td>
                  <Link href="tel:06 00 11 22 33" passHref>
                    <td className={styles.detail}>{user.phone_number}</td>
                  </Link>
                </tr>
                <tr>
                  <td>E-mail</td>
                  <td className={styles.detail}>{user.email}</td>
                </tr>
                <tr>
                  <td>Pièce d'identité</td>
                  <td className={styles.detail}>
                    <a
                      target="blank"
                      href={AssetApi.getEncoded(user.identity_card)}
                    >
                      {" "}
                      Cliquez ici{" "}
                    </a>{" "}
                  </td>
                </tr>
                <tr>
                  <td>Carte professionnelle </td>
                  <td className={styles.detail}>
                    <a
                      target="blank"
                      href={AssetApi.getEncoded(user.doctor_card)}
                    >
                      {" "}
                      Cliquez ici{" "}
                    </a>{" "}
                  </td>
                </tr>
              </table>
            </div>
          </section>

          <section className={styles.favorite}>
            <p className={styles.headerText}>Mon médecin traitant</p>
            <div className={styles.card}>
              <div className={styles.header}>
                <div>
                  <p className={styles.title}>Docteur Jean Dupont</p>
                  <p className={styles.distance}>à 300m</p>
                </div>
              </div>
              <div className={styles.header}>
                <div>
                  <p className={styles.description}>Ouvert de 9h à 19h</p>
                  <Link href="tel:06 11 22 33 44" passHref>
                    <p className={styles.call}>
                      {/* <Image src={phone} alt="Phone"></Image> Appeler */}
                    </p>
                  </Link>
                </div>
                <Link href="tel:06 11 22 33 44" passHref>
                  <button className={styles.destination}>Prendre RDV</button>
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.favorite}>
            <p className={styles.headerText}>Ma pharmacie préférée</p>
            <div className={styles.card}>
              <div className={styles.header}>
                <div>
                  <p className={styles.title}>Pharmacie du Parc</p>
                  <p className={styles.distance}>à 300m</p>
                </div>
                {/* <Image src={heart} alt="Heart"></Image> */}
              </div>
              <div className={styles.header}>
                <div>
                  <p className={styles.description}>Ouverte de 9h à 19h</p>
                  <Link href="tel:06 11 22 33 44" passHref>
                    <p className={styles.call}>
                      {/* <Image src={phone} alt="Phone"></Image> Appeler */}
                    </p>
                  </Link>
                </div>
                <button className={styles.destination}>Itinéraire</button>
              </div>
            </div>
          </section>
        </main>
        {/* <Navbar></Navbar> */}
      </div>
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
