import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"

import styles from "@/styles/App.module.css"
import logo from "@/public/logo.svg"
import AuthApi from "@/client/Auth"

export default function Footer({ user, title }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await AuthApi.logout()
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className={styles.headerContainer}>
        <p>{title}</p>
        {user && (
          <button onClick={handleLogout} className={styles.button}>
            Déconnexion
          </button>
        )}
        <Link href="/" passHref>
          <div className={styles.logoContainer}>
            <Image
              src={logo}
              alt="Logo"
              objectFit="fit"
              width="100px"
              height="100px"
            />
          </div>
        </Link>
      </div>
    </>
  )
}
