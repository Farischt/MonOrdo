import Link from "next/link"
import Layout from "@/components/layout"
import styles from "@/styles/Home.module.css"

export default function HomePage({ user, prescriptions }) {
  return (
    <Layout user={user} title={`Page d'accueil du patient ${user.first_name}`}>
      <div className={styles.page}>
        <main className={styles.main}>
          {/* <ProfileCard name={"Ornella"} /> */}
          <section className={styles.prescriptions}>
            <p className={styles.headerText}>Mes dernières ordonnances</p>
            <div className={styles.card}>
              {prescriptions && prescriptions.length ? (
                <>
                  <p className={styles.title}>
                    Docteur{" "}
                    {prescriptions[0].doctor.first_name +
                      " " +
                      prescriptions[0].doctor.last_name}
                  </p>
                  <p className={styles.description}>
                    Visite du {prescriptions[0].created_at} -{" "}
                    {prescriptions[0].expired ||
                    Date.now() >=
                      new Date(prescriptions[0].expiration_date).getTime() ? (
                      <span style={{ color: "red" }}> Expirée </span>
                    ) : (
                      <span style={{ color: "green" }}> Valide </span>
                    )}
                  </p>
                  <section className={styles.buttonContainer}>
                    <Link href="/prescription" passHref>
                      <button className={styles.consult}>
                        Consulter l&apos;ordonnance
                      </button>
                    </Link>
                    <Link href="/prescription" passHref>
                      <button className={styles.validate}>UTILISER</button>
                    </Link>
                  </section>
                </>
              ) : (
                <p> Vous n'avez aucune ordonnance pour le moment </p>
              )}
            </div>
            <Link href="/user/prescriptions" passHref>
              <button className={styles.more}>
                Voir toutes mes ordonnances
              </button>
            </Link>
          </section>

          <section className={styles.pharmacies}>
            <p className={styles.headerText}>Mes dernières ordonnances</p>
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

          <section className={styles.prescriptionsList}>
            <hr />
            <p className={styles.headerText}>Mes dernières ordonnances</p>
            <div className={styles.card}>
              <table className={styles.prescriptionsTable}>
                {prescriptions && prescriptions.length ? (
                  prescriptions.map((prescription) => {
                    return (
                      <tr key={prescription.id}>
                        <td>
                          Ordonnance de{" "}
                          <b>
                            Docteur {prescription.doctor.first_name.charAt(0)}.
                            {prescription.doctor.last_name}
                          </b>
                          .
                        </td>
                        <td className={styles.date}>
                          {prescription.created_at}
                        </td>
                        <td className={styles.date}>
                          <Link
                            href="/prescription/[prescriptionId]"
                            as={`/prescription/${prescription.id}`}
                          >
                            <button className={styles.consult}>
                              Consulter l&apos;ordonnance
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <p style={{ textAlign: "center" }}>
                    {" "}
                    Vous n'avez aucune ordonnance pour le moment !{" "}
                  </p>
                )}
              </table>
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

  if (!user || user.rpps) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const prescriptions = await Promise.all(
    (
      await user.getPrescriptions()
    ).map(async (prescription) => {
      return {
        id: prescription.id,
        doctor: await prescription.getDoctor(),
        expiration_date: prescription.expiration_date,
        reusable: prescription.reusable,
        max_use: prescription.max_use,
        content: prescription.content,
        created_at: prescription.createdAt,
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
        social_security: user.social_security,
        birth_date: user.birth_date,
        admin: user.admin,
        verified: user.verified,
      },

      prescriptions:
        prescriptions &&
        prescriptions.map((prescription) => ({
          doctor: {
            id: prescription.doctor.id,
            first_name: prescription.doctor.first_name,
            last_name: prescription.doctor.last_name,
            email: prescription.doctor.email,
            rpps: prescription.doctor.rpps,
            phone_number: prescription.doctor.phone_number,
            birth_date: prescription.doctor.birth_date,
            pharmacist: prescription.doctor.pharmacist,
          },
          id: prescription.id,
          expiration_date: prescription.expiration_date,
          reusable: prescription.reusable,
          max_use: prescription.max_use,
          content: prescription.content,
          created_at: prescription.created_at.toLocaleDateString(),
        })),
    },
  }
}
