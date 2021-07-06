import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import PharmacistApi from "@/client/Pharmacist"
import styles from "@/styles/Prescription.module.css"
import qrcode from "@/public/qrcode.png"
import alert from "@/public/alert.svg"
import Layout from "@/components/layout"
import Spinner from "@/components/Spinner"

export default function PharmacistPrescriptionPage({
  user,
  patient,
  prescription,
  doctor,
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleUsePrescription = async (prescriptionId) => {
    setLoading(true)
    try {
      await PharmacistApi.usePrescription(prescriptionId)
      setLoading(false)
      setSuccess("L'ordonnance a été utilisé avec succès !")
      router.replace(router.asPath, null, { scroll: false })
    } catch (error) {
      setLoading(false)
      setError("Cette ordonnance n'est pas utilisable car elle est ")
    }
  }

  return (
    <Layout user={user} title={`Ordonnance du patient ${patient.last_name}`}>
      <main className={styles.main}>
        <h1 style={{ textAlign: "center" }}>
          {" "}
          Cette ordonnance est authentique !{" "}
        </h1>
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
            <p>
              Bénéficiaire : {patient.last_name + " " + patient.first_name}{" "}
            </p>
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

        {Date.now() >= new Date(prescription.expiration_date).getTime() ||
        prescription.expired ||
        prescription.used === prescription.max_use ? (
          <button className={styles.contact} disabled>
            {" "}
            Expirée !{" "}
          </button>
        ) : (
          <button
            className={styles.contact}
            style={{ backgroundColor: "green" }}
            onClick={() => handleUsePrescription(prescription.id)}
          >
            {" "}
            Valider une utilisation !{" "}
          </button>
        )}
        {error && <p style={{ textAlign: "center" }}> {error} </p>}
        {success && <p style={{ textAlign: "center" }}> {success} </p>}
        {loading && <Spinner />}
      </main>
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  if (!user || (user && !user.pharmacist)) {
    return {
      redirect: {
        destination: `/prescription/${context.params.prescriptionId}`,
        permanent: false,
      },
    }
  }

  const prescription =
    context.params.prescriptionId &&
    (await Database.Prescription.findByPk(context.params.prescriptionId))

  if (!prescription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const doctor = await prescription.getDoctor()
  const patient = await prescription.getPatient()

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
        rpps: user.rpps,
        pharmacist: user.pharmacist,
        doctor_card: user.doctor_card,
        identity_card: user.identity_card,
      },

      prescription: {
        id: prescription.id,
        expiration_date: prescription.expiration_date,
        reusable: prescription.reusable,
        max_use: prescription.max_use,
        content: prescription.content,
        used: prescription.used,
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

      patient: patient && {
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        phone_number: patient.phone_number,
        birth_date: patient.birth_date,
        verified: patient.verified,
        social_security: patient.social_security,
        admin: patient.admin,
      },
    },
  }
}
