import Image from 'next/image'
import { aboutPortrait, portfolioPhotos } from '@/data/portfolioPhotos'
import { site } from '@/data/site'

export function AboutView() {
  const [primary, editorial] = portfolioPhotos

  return (
    <div className="page-about">
      <header className="about-header">
        <h1 className="about-name">{site.formalName}</h1>
      </header>

      <div className="about-grid">
        <figure className="about-portrait">
          <Image
            className="about-img"
            src={aboutPortrait.src}
            alt={`${site.formalName} — ${primary.label}`}
            width={aboutPortrait.w}
            height={aboutPortrait.h}
            sizes="(max-width: 799px) 88vw, 38vw"
            priority
          />
        </figure>
        <div className="about-copy">
          {site.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <figure className="about-editorial-wide">
        <Image
          className="about-editorial-img"
          src={editorial.src}
          alt={`${site.formalName} — ${editorial.label}`}
          width={editorial.w}
          height={editorial.h}
          sizes="(max-width: 799px) 100vw, min(90vw, 64rem)"
        />
        <figcaption className="about-editorial-caption">{editorial.label}</figcaption>
      </figure>

      <p className="about-availability">
        {site.formalName.split(' ')[0]} is available for select bookings. For availability and
        rates, please email {site.contactEmail}.
      </p>
    </div>
  )
}
