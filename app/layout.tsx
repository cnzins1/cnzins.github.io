import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clever | Portal",
  description: "Student portal for educational resources",
  icons: {
    icon: "https://resources.finalsite.net/images/f_auto,q_auto/v1689877141/mooreschoolscom/emadd6nvplrnh1vsswjf/Clever-Logo.jpg",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://resources.finalsite.net/images/f_auto,q_auto/v1689877141/mooreschoolscom/emadd6nvplrnh1vsswjf/Clever-Logo.jpg"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'