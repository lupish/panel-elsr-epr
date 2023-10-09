import './globals.css'
import Navbar from "../components/NavBar"
import Footer from "../components/Footer"

export const metadata = {
  title: 'Panel ELSR-EPR',
  description: 'Panel de admin para ELSR-EPR',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
          <link rel="shortcut icon" href="/img/favicon/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png"/>
      </head>

      <body className='bg-slate-100'>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
