import Navbar from "../components/Navbar";
// src/app/layout.tsx ou src/pages/_app.js
import '../styles/globals.css';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="fr">
          <head>
              <title>Web technologies m1</title>
          </head>
          <body>
          <Navbar/>
              {children}
          </body>
      </html>
  )
}
