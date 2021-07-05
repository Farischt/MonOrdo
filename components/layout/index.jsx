import Header from "./Header"
import Navbar from "./Navbar"

export default function Layout({ children, user, title }) {
  return (
    <>
      <Header user={user} title={title} />
      {children}
      <Navbar user={user}></Navbar>
    </>
  )
}
