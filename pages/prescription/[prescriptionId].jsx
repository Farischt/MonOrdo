import Link from "next/link"
import styles from "@/styles/Prescription.module.css"
import Image from "next/image"
import qrcode from "@/public/qrcode.png"
import alert from "@/public/alert.svg"
import Layout from "@/components/layout"

export default function Prescription({ user, prescription, doctor }) {
  return (
    <Layout user={user} title={`Mon ordonnance du docteur ${doctor.last_name}`}>
      <main className={styles.main}>
        <section className={styles.type}>
          <p className={styles.doctorName}>
            Docteur {doctor.last_name + " " + doctor.first_name}
          </p>
          <div className={styles.limitDate}>
            <p className={styles.date}>du {prescription.created_at}</p>
            {Date.now() >= new Date(prescription.expiration_date).getTime() ||
            prescription.expired ||
            prescription.used === prescription.max_use ? (
              <p className={styles.alert}>
                {/* <Image src={alert} alt="alert" layout="fill"></Image> Expire */}
                {/* bientôt */}
                Expirée !
              </p>
            ) : (
              <p style={{ color: "green" }}> Valide </p>
            )}
            <p className={styles.alert}>
              {/* <Image src={alert} alt="alert" layout="fill"></Image> Expire */}
              {/* bientôt */}
            </p>
          </div>
          <div className={styles.use}>
            {prescription.max_use - prescription.used} utilisations restantes
          </div>
        </section>
        <section className={styles.card}>
          <div className={styles.qrcode}>
            {/* <Image src={qrcode} alt="qrcode" layout="fill"></Image> */}
          </div>
          <div className={styles.qrcodeDetails}>
            <p style={{ marginTop: "0" }}>{prescription.id.toUpperCase()}</p>
            <p>Nombre d&apos;utilisations : {prescription.used || 0}</p>
          </div>
          <div className={styles.actors}>
            <p>Prescripteur : Dr {doctor.last_name}</p>
            <p>Bénéficiaire : {user.last_name + " " + user.first_name} </p>
          </div>
          <div className={styles.prescriptionDetails}>
            <p className={styles.prescriptionHeader}>
              Contenu de la prescription
            </p>
            {prescription.content &&
              prescription.content.length &&
              prescription.content.map((c, i) => {
                return (
                  <p className={styles.drugDetail} key={i}>
                    {c}
                  </p>
                )
              })}
          </div>
        </section>
        <p className={styles.signal}>
          Expire le {prescription.expiration_date}
        </p>
        <br />
        <p className={styles.help}>Un doute ? Une question ?</p>
        <button className={styles.contact}>Contactez votre médecin</button>
      </main>
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const prescription =
    context.params.prescriptionId &&
    (await Database.Prescription.findByPk(context.params.prescriptionId))

  if (!prescription || user.id !== prescription.prescripted_for) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const doctor = await prescription.getDoctor()

  return {
    props: {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        verified: user.verified,
        social_security: user.social_security,
        admin: user.admin,
      },

      prescription: {
        id: prescription.id,
        expiration_date: prescription.expiration_date,
        reusable: prescription.reusable,
        max_use: prescription.max_use,
        used: prescription.used,
        content: prescription.content,
        created_at: prescription.createdAt.toDateString(),
      },

      doctor: doctor && {
        id: doctor.id,
        first_name: doctor.first_name,
        last_name: doctor.last_name,
        email: doctor.email,
        rpps: doctor.rpps,
        phone_number: doctor.phone_number,
        birth_date: doctor.birth_date,
        pharmacist: doctor.pharmacist,
      },
    },
  }
}
