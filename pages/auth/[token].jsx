import styles from "@/styles/Register.module.css"
import Link from "next/link"

export default function AccountConfirmationPage({ email, first_name }) {
  return (
    <div className={styles.validationBackground}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h1> {first_name}, votre compte est maintenant validé ! </h1>
        <br />
        <p>
          Votre adresse mail <strong> {email} </strong> est valide ! Vous pouvez
          dès à présent profiter de 100% des fonctionnalités de MonOrdo !
        </p>
      </div>
      <Link href="/">
        <button className={styles.redirectAuth}>Se connecter</button>
      </Link>
    </div>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const { token } = context.params
  const validToken = await Database.AccountConfirmationToken.findByPk(token)

  if (!validToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const user = await Database.User.get(validToken.user_id)

  if (!user || user.verified) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  user.verified = true
  user.save()

  return {
    props: {
      success: true,
      email: user.email,
      first_name: user.first_name,
    },
  }
}
