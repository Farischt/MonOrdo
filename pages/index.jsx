import Layout from "@/components/layout"

export default function HomePage({ user }) {
  return (
    <Layout user={user}>
      <h1> Page d'accueil </h1>
    </Layout>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  return {
    props: {
      user: user && {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        admin: user.admin,
        verified: user.verified,
      },
    },
  }
}
