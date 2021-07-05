import Layout from "@/components/layout/index"
import Link from "next/link"

import styles from "@/styles/Profile.module.css"
import Image from "next/image"

import phone from "@/public/phone.svg"
import heart from "@/public/heart.svg"

export default function UserProfilePage({ user, prescriptions }) {
  return (
    <Layout user={user} title={`Profile de ${user.first_name}`}>
      <main className={styles.main}>
        <section className={styles.informations}>
          <p className={styles.headerText}>Mes informations</p>
          <div className={styles.card}>
            <table className={styles.informationsTable}>
              <tr>
                <td>N° de sécurité sociale</td>
                <td className={styles.detail}>{user.social_security}</td>
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
                    <Image
                      src={phone}
                      alt="Phone"
                      width="15px"
                      height="15px"
                    ></Image>{" "}
                    Appeler
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
              <Image src={heart} alt="Heart" width="15px" height="15px"></Image>
            </div>
            <div className={styles.header}>
              <div>
                <p className={styles.description}>Ouverte de 9h à 19h</p>
                <Link href="tel:06 11 22 33 44" passHref>
                  <p className={styles.call}>
                    <Image
                      src={phone}
                      alt="Phone"
                      width="15px"
                      height="15px"
                    ></Image>{" "}
                    Appeler
                  </p>
                </Link>
              </div>
              <button className={styles.destination}>Itinéraire</button>
            </div>
          </div>
        </section>
      </main>
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
          expiration_date: prescription.expiration_date,
          reusable: prescription.reusable,
          max_use: prescription.max_use,
          content: prescription.content,
          created_at: prescription.created_at.toLocaleDateString(),
        })),
    },
  }
}
