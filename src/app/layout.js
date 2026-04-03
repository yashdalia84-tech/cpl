import { Rajdhani } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-rajdhani',
})

export const metadata = {
  title: 'CPL Season 4 — Auction',
  description: 'Clublife Premier League Season 4 Player Auction',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} font-rajdhani`}>
        {children}
      </body>
    </html>
  )
}