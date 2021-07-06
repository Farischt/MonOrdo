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
            {" "}
            Log out{" "}
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

      {/* <nav>
        <ul>
          <li>
            <Link href="/">
              <a> Home </a>
            </Link>
          </li>
          {user && user.rpps && !user.pharmacist && (
            <li>
              <Link href="/doctor">
                <a> Espace médecin </a>
              </Link>
            </li>
          )}
          {user && user.admin && (
            <li>
              <Link href="/admin">
                <a> Admin </a>
              </Link>
            </li>
          )}
          {user && user.pharmacist && (
            <li>
              <Link href="/pharmacist">
                <a> Espace pharmacien </a>
              </Link>
            </li>
          )}

          {!user && (
            <>
              <li>
                <Link href="/">
                  <a className={styles.button}> Sign in </a>
                </Link>
              </li>
              <li>
                <Link href="/auth/register">
                  <a className={styles.button}> Sign Up </a>
                </Link>
              </li>
              <li>
                <Link href="/auth/doctor">
                  <a className={styles.button}> Connexion médecin </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav> */}
    </>
  )
}
