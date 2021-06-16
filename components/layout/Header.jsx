import Link from "next/link"

export default function Footer() {
  return (
    <>
      <h4> This is a Header </h4>
      <nav>
        <ul>
          <li>
            <Link href={"/"}>
              <a> Home </a>
            </Link>
          </li>
          <li>
            <Link href={"/auth/"}>
              <a> Sign in </a>
            </Link>
          </li>
          <li>
            <Link href={"/auth/register"}>
              <a> Sign Up </a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
