'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { portfolioPhotoAt } from '@/data/portfolioPhotos'
import { site } from '@/data/site'

const navHeadshot = portfolioPhotoAt(0)

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  const mainRef = useRef<HTMLElement | null>(null)
  const worksActive = pathname.startsWith('/works')
  const aboutActive = pathname.startsWith('/about')
  const contactActive = pathname.startsWith('/contact')

  useLayoutEffect(() => {
    document.documentElement.classList.add('site-loaded')
  }, [])

  /** Replay content enter transitions on client-side navigations. */
  useLayoutEffect(() => {
    const el = mainRef.current
    if (!el) return
    el.classList.remove('route-enter')
    void el.offsetHeight
    el.classList.add('route-enter')
  }, [pathname])

  return (
    <div className="site-shell">
      <div className="ambient-splotches" aria-hidden>
        <div className="ambient-splotch ambient-splotch--plum" />
        <div className="ambient-splotch ambient-splotch--olive" />
        <div className="ambient-splotch ambient-splotch--blush" />
        <div className="ambient-splotch ambient-splotch--honey" />
        <div className="ambient-splotch ambient-splotch--dust" />
      </div>
      <header className="editorial-header">
        <div className="editorial-header-inner">
          <Link href="/" className="editorial-brand">
            <span className="editorial-brand-mark" aria-hidden>
              <Image
                className="editorial-brand-img"
                src={navHeadshot.src}
                alt=""
                width={navHeadshot.w}
                height={navHeadshot.h}
                sizes="40px"
              />
            </span>
            <span className="editorial-logo">{site.logoMark}</span>
          </Link>
          <nav className="editorial-nav" aria-label="Primary">
            <Link href="/works" className={worksActive ? 'is-active' : undefined}>
              Work
            </Link>
            <Link href="/about" className={aboutActive ? 'is-active' : undefined}>
              About
            </Link>
            <Link href="/contact" className={contactActive ? 'is-active' : undefined}>
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main ref={mainRef} className="editorial-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
