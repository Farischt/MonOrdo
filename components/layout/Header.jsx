import Link from "next/link"
import { useRouter } from "next/router"

import AuthApi from "@/client/Auth"

export default function Footer({ user }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await AuthApi.logout()
      router.push("/auth")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h4> This is a Header </h4>
      <nav>
        <ul>
          {user && <li> Welcome {user.first_name} ! </li>}
          <li>
            <Link href="/">
              <a> Home </a>
            </Link>
          </li>
          {user && user.rpps && (
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
          {!user && (
            <>
              <li>
                <Link href="/auth/">
                  <a> Sign in </a>
                </Link>
              </li>
              <li>
                <Link href="/auth/register">
                  <a> Sign Up </a>
                </Link>
              </li>
              <li>
                <Link href="/auth/doctor">
                  <a> Espace médecin </a>
                </Link>
              </li>
            </>
          )}
          {user && <button onClick={handleLogout}> Log out </button>}
        </ul>
      </nav>
    </>
  )
}
