import Link from "next/link"
import styles from "@/styles/Prescription.module.css"
import Image from "next/image"
import qrcode from "@/public/qrcode.png"
import alert from "@/public/alert.svg"
import Layout from "@/components/layout"

export default function Prescription() {
  return (
    <Layout user={user} title="Mon ordonnance">
      <main className={styles.main}>
        <section className={styles.type}>
          <p className={styles.doctorName}>Docteur X</p>
          <div className={styles.limitDate}>
            <p className={styles.date}>du 12/09/2021</p>
            <p className={styles.alert}>
              <Image src={alert} alt="alert"></Image> Expire bientôt
            </p>
          </div>
          <div className={styles.use}>2/3 utilisations restantes</div>
        </section>
        <section className={styles.card}>
          <div className={styles.qrcode}>
            <Image src={qrcode} alt="qrcode"></Image>
          </div>
          <div className={styles.qrcodeDetails}>
            <p style={{ marginTop: "0" }}>XEDFTSOI</p>
            <p>Nombre d&apos;utilisations : 3</p>
          </div>
          <div className={styles.actors}>
            <p>Prescripteur : Dr X.</p>
            <p>Bénéficiaire : Émilie Paris</p>
          </div>
          <div className={styles.prescriptionDetails}>
            <p className={styles.prescriptionHeader}>
              Contenu de la prescription
            </p>
            <p>3x Promenades matinales</p>
            <p>2L d&apos;eau par jour</p>
            <p className={styles.drugDetail}>5 fruits et légumes par jour</p>
          </div>
        </section>
        <p className={styles.signal}>Expire le 12/12/2021</p>
        <br />
        <p className={styles.help}>Un doute ? Une question ?</p>
        <button className={styles.contact}>Contactez votre médecin</button>
      </main>
    </Layout>
  )
}
