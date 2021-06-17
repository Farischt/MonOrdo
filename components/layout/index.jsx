import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children, user }) {
  return (
    <>
      <Header user={user} />
      {children}
      <Footer />
    </>
  )
}
