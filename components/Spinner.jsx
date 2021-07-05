import styles from "@/styles/Spinner.module.css"

export default function Spinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      {/* <span className={styles.text}> Chargement... </span> */}
    </div>
  )
}
