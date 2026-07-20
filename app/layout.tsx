import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const SITE_URL = 'https://mktips.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MK TIPS — Tips Esportivas Premium com ROI Transparente',
    template: '%s | MK TIPS',
  },
  description:
    'A plataforma SaaS premium de tips esportivas. Receba as melhores oportunidades do dia, aposte na melhor casa com um clique e acompanhe seu ROI, yield e banca em tempo real.',
  keywords: [
    'tips esportivas',
    'apostas esportivas',
    'palpites',
    'tipster',
    'ROI',
    'gestão de banca',
    'apostas de valor',
    'odds',
  ],
  authors: [{ name: 'MK TIPS' }],
  creator: 'MK TIPS',
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'MK TIPS',
    title: 'MK TIPS — Tips Esportivas Premium com ROI Transparente',
    description:
      'Receba as melhores oportunidades do dia, aposte na melhor casa com um clique e acompanhe seu desempenho em tempo real.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MK TIPS — Tips Esportivas Premium',
    description:
      'A plataforma SaaS premium de tips esportivas com ROI transparente e gestão de banca inteligente.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon-192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MK TIPS',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c1210',
  width: 'device-width',
  initialScale: 1,
}

import { PwaInstallBanner } from '@/components/pwa-install-banner'
import { SecurityGuard } from '@/components/security-guard'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans antialiased" suppressHydrationWarning>
        <SecurityGuard />
        {children}
        <PwaInstallBanner />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
