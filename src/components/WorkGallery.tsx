import type { CSSProperties } from 'react'
import Image from 'next/image'
import { workGalleryPhotos } from '@/data/portfolioPhotos'
import { site } from '@/data/site'

const toneClasses = ['work-bento-item--c0', 'work-bento-item--c1', 'work-bento-item--c2', 'work-bento-item--c3'] as const

export function WorkGallery() {
  return (
    <div className="page-work">
      <div className="work-page-atmosphere" aria-hidden>
        <span className="work-splotch work-splotch--plum" />
        <span className="work-splotch work-splotch--olive" />
        <span className="work-splotch work-splotch--blush" />
        <span className="work-splotch work-splotch--honey" />
      </div>

      <header className="work-page-header">
        <p className="work-page-eyebrow">Selected frames</p>
        <h1 className="work-page-title">Work</h1>
        <p className="work-page-lede">
          Even, modest crops in a small grid — the same uploads as elsewhere, presented so you can browse without a
          single image taking over the screen.
        </p>
      </header>

      <ul className="work-bento">
        {workGalleryPhotos.map((p, i) => (
          <li
            key={p.id}
            className={`work-bento-item ${toneClasses[i % toneClasses.length]}`}
            style={{ '--stagger': String(i) } as CSSProperties}
          >
            <figure className="work-bento-figure">
              <div className="work-bento-frame">
                <Image
                  className="work-bento-img"
                  src={p.src}
                  alt={`${site.formalName} — ${p.label}`}
                  fill
                  sizes="(max-width: 599px) 50vw, (max-width: 899px) 33vw, 28vw"
                />
              </div>
              <figcaption className="work-bento-caption">{p.label}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
