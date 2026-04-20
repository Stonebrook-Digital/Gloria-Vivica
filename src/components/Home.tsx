import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { heroPortrait, heroRunway, portfolioPhotos } from '@/data/portfolioPhotos'
import { site } from '@/data/site'
const homeSelections = portfolioPhotos.slice(0, 3)

export function Home() {
  const portraitSrc = site.headshotHero ?? heroPortrait.src

  return (
    <div className="page-home">
      <section className="hero-editorial page-reveal" aria-labelledby="hero-name">
        <div className="hero-editorial-inner">
          <figure className="hero-figure hero-figure--portrait">
            <Image
              className="hero-img"
              src={portraitSrc}
              alt={`${site.formalName} — ${portfolioPhotos[0].label}`}
              width={heroPortrait.w}
              height={heroPortrait.h}
              sizes="(max-width: 799px) 88vw, 28vw"
              priority
            />
          </figure>
          <h1 id="hero-name" className="hero-name">
            {site.formalName}
          </h1>
          <figure className="hero-figure hero-figure--runway">
            <Image
              className="hero-img"
              src={heroRunway.src}
              alt={`${site.formalName} — ${portfolioPhotos[1].label}`}
              width={heroRunway.w}
              height={heroRunway.h}
              sizes="(max-width: 799px) 100vw, 44vw"
              priority
            />
          </figure>
        </div>
      </section>

      <section className="headshots-section" aria-labelledby="headshots-heading">
        <div className="headshots-section-inner">
          <h2 id="headshots-heading" className="headshots-heading">
            Selected stills
          </h2>
          <p className="headshots-lede">
            A tighter preview for <span className="headshots-name">{site.formalName}</span>, with the full set on
            Work.
          </p>
          <ul className="headshots-list">
            {homeSelections.map((item, i) => (
              <li
                key={item.id}
                className="headshots-item headshot-stagger"
                style={{ '--stagger': String(i) } as CSSProperties}
              >
                <figure className="headshots-figure">
                  <Image
                    className="headshots-img"
                    src={item.src}
                    alt={`${site.formalName} — ${item.label}`}
                    width={item.w}
                    height={item.h}
                    sizes="(max-width: 799px) 100vw, (max-width: 1279px) 45vw, 32rem"
                  />
                  <figcaption className="headshots-caption">{item.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="discover-strip page-reveal" aria-label="Selected work">
        <Link href="/works" className="discover-link">
          <span className="discover-text">21 projects — discover more</span>
          <span className="discover-arrow" aria-hidden>
            ↓
          </span>
        </Link>
      </section>
    </div>
  )
}
