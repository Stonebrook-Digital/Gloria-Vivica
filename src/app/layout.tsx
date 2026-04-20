import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { SiteShell } from '@/components/SiteShell'
import './globals.css'

const siteMetaDescription =
  'Minimal editorial portfolio — film, theatre, select bookings.'

const sans = Montserrat({
  subsets: ['latin'],
  variable: '--font-editorial',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Gloria Laurent',
  description: siteMetaDescription,
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
