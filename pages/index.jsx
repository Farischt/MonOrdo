export default function Home() {
  return <h1> Page d'accueil </h1>
}

import Database from "@/server/database"

export const getServerSideProps = (context) => {
  const user = Database.User.findOne({
    where: {
      email: "test",
    },
  })

  return {
    props: {
      success: true,
    },
  }
}
