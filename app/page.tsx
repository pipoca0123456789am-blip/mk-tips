'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Bookmakers } from '@/components/landing/bookmakers'
import { TrustBar } from '@/components/landing/stats'
import { HowItWorks } from '@/components/landing/how-it-works'
import { AppSection } from '@/components/landing/app-section'
import { WhyThousandsChoose } from '@/components/landing/why-thousands-choose'
import { ComparisonSection } from '@/components/landing/comparison-section'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { Faq } from '@/components/landing/faq'
import { Cta } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'
import { Checkout } from '@/components/landing/checkout'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MK TIPS',
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Web',
  description:
    'Plataforma SaaS premium de tips esportivas com ROI transparente, comparação de odds e gestão de banca.',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '49.90', priceCurrency: 'BRL' },
    { '@type': 'Offer', name: 'Premium', price: '97.90', priceCurrency: 'BRL' },
    { '@type': 'Offer', name: 'VIP Anual', price: '497.90', priceCurrency: 'BRL' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2480',
  },
}

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const p = params.get('plan')
      if (p) {
        window.location.href = `/checkout?plan=${p}`
      }
    }
  }, [])

  const handleStartFree = () => {
    window.location.href = '/checkout?plan=Free'
  }
  const handleSelectPlan = (plan: 'Free' | 'Starter' | 'Premium' | 'VIP Anual' | 'Elite') => {
    window.location.href = `/checkout?plan=${plan}`
  }

  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar onStartFree={handleStartFree} />
      <Hero onStartFree={handleStartFree} />
      <Bookmakers />
      <TrustBar />
      <HowItWorks />
      <AppSection />
      <WhyThousandsChoose />
      <ComparisonSection />
      <Pricing onSelectPlan={handleSelectPlan} />
      <Testimonials />
      <Faq />
      <Cta onStartFree={handleStartFree} />
      <Footer />
    </main>
  )
}
