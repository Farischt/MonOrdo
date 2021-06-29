import Layout from "@/components/layout"

export default function AdminIndexPage({ user }) {
  return (
    <Layout user={user}>
      <h1> Page d'accueil admin </h1>
    </Layout>
  )
}

import Backend from "@/server/index"
export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)
  if (!user || !user.admin) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        admin: user.admin,
      },
    },
  }
}
