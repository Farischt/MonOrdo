import { useState } from "react"
import Link from "next/link"

import Layout from "@/components/layout"
import styles from "@/styles/Prescriptions.module.css"

export default function DoctorPrescriptionPage({ user }) {
  const [prescription, setPrescription] = useState({
    patient_social_code: "",
    expiration_date: "",
    reusable: false,
    max_use: 1,
    content: [""],
  })

  const handlePrescriptionChange = (event) => {
    if (event.target.name === "reusable") {
      setPrescription((state) => ({
        ...state,
        reusable: !state.reusable,
      }))
    }

    setPrescription((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <Layout user={user} title="Mes ordonnances">
      <main className={styles.main}>
        <p style={{ width: "100%", color: "#979797CC", marginBottom: "15px" }}>
          Générer une ordonnance
        </p>
        <form method="POST">
          <input
            type="text"
            name="patient_social_code"
            className={styles.search}
            value={prescription.patient_social_code}
            onChange={handlePrescriptionChange}
            placeholder="Numéro de sécurité sociale du patient..."
            required
          />
          <input
            type="date"
            name="expiration_date"
            value={prescription.expiration_date}
            onChange={handlePrescriptionChange}
            placeholder="Date d'éxpiration..."
            required
          />
          <div>
            <label htmlFor="reusable" style={{ color: "#979797CC" }}>
              {" "}
              L'ordonnance est-elle réutilisable ?{" "}
            </label>
            <input
              type="checkbox"
              id="reusable"
              name="reusable"
              checked={prescription.reusable}
              onChange={handlePrescriptionChange}
            />
          </div>
          {/* {prescription &&
          prescription.content &&
          prescription.content.map((e, i) => {
            return (
              <input
                key={i}
                type="text"
                name="e"
                value={e}
                placeholder="Contenu..."
                value={e}
                onChange={(event) => handleContentChange(event, i)}
                required
              />
            )
          })} */}
        </form>
        <input
          type="search"
          name="search"
          id=""
          className={styles.search}
          placeholder="Rechercher une ordonnance"
          defaultValue=""
        />
        <p style={{ width: "100%", color: "#979797CC" }}>Trier par</p>
        <section className={styles.orders}>
          <select name="doctor" id="doctor-select" placeholder="Docteur">
            <option>Docteur</option>
            <option value="docteur_x">Docteur X</option>
            <option value="docteur_y">Docteur Y</option>
            <option value="docteur_z">Docteur Z</option>
          </select>
          <input
            type="date"
            id="start"
            name="prescriptionDate"
            min="2018-01-01"
            max="today"
          ></input>
          <select name="valid" id="valid-select">
            <option>Valable</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </section>
        <section className={styles.prescriptionsList}>
          <div>
            <table className={styles.prescriptionsTable}>
              <tbody>
                <tr>
                  <td>
                    <b>Docteur X</b>
                  </td>
                  <td className={styles.date}>10/03/2021</td>
                  <td>
                    <Link href="/prescription" passHref>
                      <button className={styles.validate}>UTILISER</button>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Docteur X</b>
                  </td>
                  <td className={styles.date}>09/02/2021</td>
                  <td>
                    <Link href="/prescription" passHref>
                      <button className={styles.validate}>UTILISER</button>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Docteur X</b>
                  </td>
                  <td className={styles.date}>12/01/2021</td>
                  <td>
                    <button className={styles.consult}>Consulter</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Docteur X</b>
                  </td>
                  <td className={styles.date}>09/09/2020</td>
                  <td>
                    <button className={styles.consult}>Consulter</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Docteur X</b>
                  </td>
                  <td className={styles.date}>23/06/2020</td>
                  <td>
                    <button className={styles.consult}>Consulter</button>
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

  if (!user || !user.rpps || user.pharmacist) {
    return {
      redirect: {
        destination: "/auth",
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
